# Arquitectura inicial del sistema HRA

![Arquitectura Inicial del Sistema Web HRA](../../Img/img01.png)

## Diagrama de arquitectura

```mermaid
flowchart TD

%% =========================
%% ACTORES
%% =========================
subgraph ACTORES["ACTORES"]
    Paciente["Paciente"]
    Admision["Personal de Admisión"]
    Medico["Médico / Profesional de Salud"]
    AdminTI["Administrador de TI"]
end

%% =========================
%% PRESENTACIÓN
%% =========================
subgraph PRESENTACION["PRESENTACIÓN"]
    Web["Aplicación Web (SPA)"]
    API["API REST Gateway / Entrypoint"]
end

%% =========================
%% LÓGICA DE NEGOCIO (MÓDULOS)
%% =========================
subgraph NEGOCIO["LÓGICA DE NEGOCIO (MONOLITO MODULAR)"]
    Usuarios["Usuarios y Autenticación"]
    Pacientes["Gestión de Pacientes"]
    Citas["Citas y Programación de Horarios"]
    Atenciones["Atenciones Clínicas"]
    Resultados["Diagnósticos y Resultados Médicos"]
    Notificaciones["Notificaciones"]
    Auditoria["Auditoría y Trazabilidad"]
end

%% =========================
%% DATOS Y ALMACENAMIENTO
%% =========================
subgraph DATOS["DATOS Y CACHÉ"]
    BD[("Base de Datos Relacional (PostgreSQL)")]
    Cache[("Caché en Memoria (Redis)")]
    Storage[("Almacenamiento de Archivos (MinIO / S3)")]
end

%% =========================
%% SISTEMAS EXTERNOS
%% =========================
subgraph EXTERNOS["SISTEMAS EXTERNOS"]
    RENIEC["Servicio RENIEC (Validación DNI)"]
    EmailSMS["Servicio de Notificaciones (SMTP / WhatsApp)"]
    FirmaDigital["Servicio de Firma / Sellado Digital"]
end

%% =========================
%% FLUJO PRINCIPAL
%% =========================
ACTORES --> Web
Web --> API
API --> NEGOCIO
NEGOCIO --> BD
NEGOCIO --> Cache
NEGOCIO --> Storage

%% =========================
%% INTEGRACIONES EXTERNAS
%% =========================
Pacientes --> RENIEC
Notificaciones --> EmailSMS
Resultados --> FirmaDigital

%% =========================
%% DISTRIBUCIÓN HORIZONTAL
%% =========================
Paciente ~~~ Admision
Admision ~~~ Medico
Medico ~~~ AdminTI

Usuarios ~~~ Pacientes
Pacientes ~~~ Citas
Citas ~~~ Atenciones
Atenciones ~~~ Resultados
Resultados ~~~ Notificaciones
Notificaciones ~~~ Auditoria

BD ~~~ Cache
Cache ~~~ Storage

RENIEC ~~~ EmailSMS
EmailSMS ~~~ FirmaDigital

%% =========================
%% ESTILOS
%% =========================
style ACTORES fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
style PRESENTACION fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
style NEGOCIO fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
style DATOS fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
style EXTERNOS fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff

style Paciente fill:#0f172a,stroke:#38bdf8,color:#fff
style Admision fill:#0f172a,stroke:#38bdf8,color:#fff
style Medico fill:#0f172a,stroke:#38bdf8,color:#fff
style AdminTI fill:#0f172a,stroke:#38bdf8,color:#fff

style Web fill:#0f172a,stroke:#38bdf8,color:#fff
style API fill:#0f172a,stroke:#38bdf8,color:#fff

style Usuarios fill:#0f172a,stroke:#38bdf8,color:#fff
style Pacientes fill:#0f172a,stroke:#38bdf8,color:#fff
style Citas fill:#0f172a,stroke:#38bdf8,color:#fff
style Atenciones fill:#0f172a,stroke:#38bdf8,color:#fff
style Resultados fill:#0f172a,stroke:#38bdf8,color:#fff
style Notificaciones fill:#0f172a,stroke:#38bdf8,color:#fff
style Auditoria fill:#0f172a,stroke:#38bdf8,color:#fff

style BD fill:#0f172a,stroke:#38bdf8,color:#fff
style Cache fill:#0f172a,stroke:#38bdf8,color:#fff
style Storage fill:#0f172a,stroke:#38bdf8,color:#fff

style RENIEC fill:#0f172a,stroke:#38bdf8,color:#fff
style EmailSMS fill:#0f172a,stroke:#38bdf8,color:#fff
style FirmaDigital fill:#0f172a,stroke:#38bdf8,color:#fff
```

## Descripción

La arquitectura inicial del sistema HRA (Hospital Regional Docente de Las Mercedes) se organiza en cuatro capas y límites de integración bien definidos:

- **Presentación:** Gestiona la interacción de los usuarios mediante una aplicación web de una sola página (SPA) responsiva y accesible desde navegadores móviles o de escritorio. Toda comunicación se canaliza hacia una API REST centralizada que autentica peticiones y valida datos de entrada.
- **Lógica de negocio:** Organizada bajo un enfoque de **monolito modular**. Cada módulo encapsula un dominio funcional del hospital:
  - *Usuarios y Autenticación:* Gestión de credenciales, roles y sesiones JWT.
  - *Gestión de Pacientes:* Registro, filiación y validación de identidad.
  - *Citas y Programación:* Gestión de agendas médicas, disponibilidad de turnos, reserva concurrente y reprogramación.
  - *Atenciones Clínicas:* Registro de consultas médicas y evolución clínica.
  - *Diagnósticos y Resultados:* Emisión y consulta de órdenes de laboratorio e imágenes médicas.
  - *Notificaciones:* Despacho asíncrono de recordatorios y avisos clínicos.
  - *Auditoría y Trazabilidad:* Registro inmutable de operaciones sensibles para cumplimiento normativo de salud.
- **Datos y Almacenamiento:** 
  - *Base de datos relacional (PostgreSQL):* Garantiza consistencia transaccional ACID para historias clínicas, citas y datos de filiación.
  - *Caché en memoria (Redis):* Almacena agendas y catálogos de alta frecuencia de lectura para optimizar tiempos de respuesta (< 1.5s).
  - *Almacenamiento de objetos (MinIO / S3):* Guarda de forma segura archivos pesados (informes en PDF y resultados de laboratorio escaneados).
- **Integraciones externas:**
  - *RENIEC:* Valida la autenticidad del Documento Nacional de Identidad en el registro.
  - *Servicio de Notificaciones:* Envío de correos y alertas de citas.
  - *Servicio de Firma / Sellado Digital:* Firma digital de reportes médicos diagnósticos.
