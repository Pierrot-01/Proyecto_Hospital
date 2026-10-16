# Principios de diseño (SOLID)

## Objetivo

Documentar cómo se aplican los principios SOLID en el backend del sistema HRA, organizado con Clean Architecture, para que cada módulo se programe de forma uniforme y las reglas de negocio no dependan de la tecnología.

## Contexto

- **Estilo:** monolito modular (Java + Spring Boot + Spring Modulith o TypeScript + Express).
- **Enfoque interno:** Clean Architecture (presentación, aplicación, dominio, infraestructura).
- **Módulo de referencia:** Citas, porque concentra la concurrencia de reservas, la prevención de doble asignación y la integración con notificaciones.

## SOLID en el módulo Citas

![Principios SOLID en el Módulo Citas](../../../Img/img10.png)

```mermaid
flowchart TD

%% ====================================================
%% APLICACIÓN DEL PRINCIPIO DIP (DEPENDENCY INVERSION)
%% ====================================================

subgraph PRESENTACION["CAPA DE PRESENTACIÓN (Controlador HTTP)"]
    Ctrl["<b>CitaController</b><br>+reservar(req, res): Promise<br><i>Responsabilidad Única (SRP)</i>"]
end

subgraph APLICACION["CAPA DE APLICACIÓN (Orquestación del Caso de Uso)"]
    UC["<b>ReservarCitaUseCase</b><br>+ejecutar(cmd): Promise&lt;string&gt;<br><i>Depende solo de abstracciones (DIP)</i>"]
end

subgraph DOMINIO["CAPA DE DOMINIO (Contratos e Interfaces Segregadas)"]
    direction TB
    RepoInter["&laquo;interface&raquo;<br><b>CitaRepository</b><br>+guardar(cita): Promise&lt;void&gt;<br>+existeCupo(horario): Promise&lt;boolean&gt;<br><i>Segregación de Interfaces (ISP)</i>"]
    NotifInter["&laquo;interface&raquo;<br><b>NotificadorPort</b><br>+enviar(cita): Promise&lt;void&gt;<br><i>Segregación de Interfaces (ISP)</i>"]
    Entidad["<b>Entidad Cita</b><br>Reglas invariantes médicas<br><i>Lógica pura sin frameworks</i>"]
end

subgraph INFRAESTRUCTURA["CAPA DE INFRAESTRUCTURA (Adaptadores Tecnológicos)"]
    direction TB
    PostgresRepo["<b>PostgresCitaRepository</b><br>SQL Transaccional / TypeORM<br><i>Sustituible (LSP / OCP)</i>"]
    EmailAdap["<b>EmailNotificadorAdapter</b><br>Protocolo SMTP / TLS<br><i>Sustituible (LSP / OCP)</i>"]
    SmsAdap["<b>SmsNotificadorAdapter</b><br>API Twilio REST<br><i>Abierto a extensión (OCP)</i>"]
end

subgraph COMPOSICION["RAÍZ DE COMPOSICIÓN (Inyección de Dependencias)"]
    ModuloIoC["<b>citas.module.ts</b><br>Contenedor IoC / NestJS Provider<br>Resuelve: CitaRepository &rarr; PostgresCitaRepository<br>Resuelve: NotificadorPort &rarr; EmailNotificadorAdapter"]
end

%% Flujo y Dependencias
Ctrl -->|"invoca caso de uso"| UC
UC -->|"usa entidad pura"| Entidad
UC -->|"depende de abstracción (DIP)"| RepoInter
UC -->|"depende de abstracción (DIP)"| NotifInter

PostgresRepo -.->|"implementa interfaz"| RepoInter
EmailAdap -.->|"implementa interfaz"| NotifInter
SmsAdap -.->|"implementa interfaz"| NotifInter

ModuloIoC -.->|"instancia e inyecta"| UC
ModuloIoC -.->|"instancia e inyecta"| PostgresRepo
ModuloIoC -.->|"instancia e inyecta"| EmailAdap

style PRESENTACION fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff
style APLICACION fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
style DOMINIO fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff
style INFRAESTRUCTURA fill:#451a03,stroke:#fb923c,stroke-width:2px,color:#fff
style COMPOSICION fill:#1e293b,stroke:#94a3b8,stroke-dasharray: 5 5,color:#fff

style Ctrl fill:#1e293b,stroke:#38bdf8,color:#fff
style UC fill:#312e81,stroke:#a5b4fc,stroke-width:2px,color:#fff
style Entidad fill:#065f46,stroke:#6ee7b7,color:#fff
style RepoInter fill:#047857,stroke:#a7f3d0,stroke-width:2px,color:#fff
style NotifInter fill:#047857,stroke:#a7f3d0,stroke-width:2px,color:#fff
style PostgresRepo fill:#7c2d12,stroke:#fdba74,color:#fff
style EmailAdap fill:#7c2d12,stroke:#fdba74,color:#fff
style SmsAdap fill:#7c2d12,stroke:#fdba74,color:#fff
style ModuloIoC fill:#334155,stroke:#cbd5e1,color:#fff
```

| Principio | Dónde se aplica (capa) | Cómo se cumple en el sistema HRA | Clases |
|---|---|---|---|
| **S** · Responsabilidad única | Todas las capas | Cada clase tiene una sola tarea: el controlador recibe la petición HTTP, el caso de uso coordina la reserva, la entidad aplica las reglas de la cita y el repositorio guarda en PostgreSQL. | `CitaController`, `ReservarCitaUseCase`, `Cita`, `JpaCitaRepository` / `PostgresCitaRepository` |
| **O** · Abierto/cerrado | Infraestructura | Para agregar un nuevo canal de notificación (SMS, WhatsApp) se crea un nuevo adaptador; el caso de uso de reserva no se modifica. | `EmailNotificadorAdapter`, futuro `SmsNotificadorAdapter` |
| **L** · Sustitución de Liskov | Infraestructura | Email y un futuro SMS implementan `NotificadorPort` con el mismo contrato; el caso de uso funciona igual con cualquiera. | `EmailNotificadorAdapter`, futuro `SmsNotificadorAdapter` |
| **I** · Segregación de interfaces | Dominio | Cada interfaz tiene solo lo que el módulo necesita: `CitaRepository` solo guarda y busca citas, `NotificadorPort` solo envía avisos, `DisponibilidadRepository` solo consulta cupos. | `CitaRepository`, `NotificadorPort`, `DisponibilidadRepository` |
| **D** · Inversión de dependencias | Aplicación | El caso de uso recibe interfaces por el constructor y no conoce JPA, JavaMail ni PostgreSQL; las implementaciones se conectan en la configuración o contenedor IoC del módulo. | `ReservarCitaUseCase`, configuración del módulo Citas |

## Qué pasaría sin SOLID en el sistema HRA

| Situación real | Sin SOLID | Con SOLID |
|---|---|---|
| Se cambia el proveedor de correo | Hay que modificar el caso de uso de reserva | Solo se crea un nuevo adaptador |
| Se agrega almacenamiento S3 diferente | Se modifica el código del módulo Laboratorio | Solo se reemplaza `S3AlmacenamientoAdapter` |
| Se quiere probar la reserva de citas | Se necesita PostgreSQL y el servicio de correo real | Se prueba con implementaciones en memoria (fakes/mocks) |
| Cambia una regla de la cita (ej: tiempo mínimo de cancelación) | Hay que buscarla en controladores y servicios | Está solo en la entidad `Cita` |
| Se quiere verificar la integridad del cupo | Se necesita montar todo el sistema | Se prueba la entidad y el caso de uso aislados |

## Relación con Clean Architecture y los patrones

| Principio | Lo cumple en el proyecto |
|---|---|
| Responsabilidad única | La separación en capas de Clean Architecture |
| Abierto/cerrado y Liskov | El patrón Adapter (notificaciones, almacenamiento) |
| Segregación de interfaces | Los puertos del dominio (`CitaRepository`, `NotificadorPort`, `AlmacenamientoPort`) |
| Inversión de dependencias | El patrón Repository y la regla de dependencia: las capas externas dependen del dominio |
