# Arquitectura inicial del sistema HRA

![Arquitectura Inicial del Sistema Web HRA](../../Img/img01.png)

## Diagrama de arquitectura

<!-- imagen #01 — Arquitectura Inicial General del Sistema HRA -->

```mermaid
flowchart TD

%% =========================
%% ACTORES
%% =========================
subgraph ACTORES["👥 ACTORES DEL SISTEMA"]
    Paciente["<b>Paciente</b><br>Reserva citas y descarga resultados"]
    Admision["<b>Personal de Admisión</b><br>Registra pacientes y gestiona turnos"]
    Medico["<b>Médico / Profesional</b><br>Registra atenciones y firma diagnósticos"]
    AdminTI["<b>Administrador de TI</b><br>Gestiona roles, catálogos y auditoría"]
end

%% =========================
%% PRESENTACIÓN
%% =========================
subgraph PRESENTACION["🖥️ CAPA DE PRESENTACIÓN"]
    Web["<b>Aplicación Web (SPA)</b><br>Angular 18 · TypeScript<br>Interfaz responsiva — HTTPS"]
    API["<b>API REST Gateway</b><br>Entrypoint unificado<br>JWT · Validación DTOs · RBAC"]
end

%% =========================
%% LÓGICA DE NEGOCIO (MÓDULOS)
%% =========================
subgraph NEGOCIO["⚙️ LÓGICA DE NEGOCIO — MONOLITO MODULAR"]
    Usuarios["<b>Usuarios y Autenticación</b><br>Credenciales, roles y tokens JWT"]
    Pacientes["<b>Gestión de Pacientes</b><br>Filiación, historia clínica y DNI"]
    Citas["<b>Citas y Programación</b><br>Agendas, cupos y reserva concurrente"]
    Atenciones["<b>Atenciones Clínicas</b><br>Consultas médicas y evolución"]
    Resultados["<b>Diagnósticos y Resultados</b><br>Laboratorio, imágenes y PDFs"]
    Notificaciones["<b>Notificaciones</b><br>Correos y alertas asíncronas"]
    Auditoria["<b>Auditoría</b><br>Pistas inmutables — solo INSERT"]
end

%% =========================
%% DATOS Y ALMACENAMIENTO
%% =========================
subgraph DATOS["💾 DATOS Y CACHÉ"]
    BD[("🗄️ PostgreSQL 16<br>Garantía ACID — Transacciones")]
    Cache[("⚡ Redis 7<br>Caché y Candados Distribuidos")]
    Storage[("📁 MinIO / S3<br>PDFs e Imágenes Médicas")]
end

%% =========================
%% SISTEMAS EXTERNOS
%% =========================
subgraph EXTERNOS["🌐 SISTEMAS EXTERNOS"]
    RENIEC["<b>RENIEC</b><br>Validación DNI — HTTPS REST"]
    EmailSMS["<b>Servicio SMTP</b><br>Correos y alertas — TLS 587"]
    FirmaDigital["<b>Firma Digital</b><br>Sellado criptográfico — HTTPS"]
end

%% =========================
%% FLUJO PRINCIPAL
%% =========================
ACTORES -->|"HTTPS — Navegador web"| Web
Web -->|"REST + JWT"| API
API -->|"Invocación en memoria"| NEGOCIO
NEGOCIO -->|"SQL transaccional"| BD
Citas -->|"SET NX EX — Candado"| Cache
NEGOCIO -->|"S3 API — Archivos"| Storage

%% =========================
%% INTEGRACIONES EXTERNAS
%% =========================
Pacientes -->|"Adapter HTTPS REST"| RENIEC
Notificaciones -->|"Adapter SMTP"| EmailSMS
Resultados -->|"Adapter HTTPS REST"| FirmaDigital

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
%% ESTILOS — Un color por capa
%% =========================
style ACTORES fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#fff
style PRESENTACION fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
style NEGOCIO fill:#14532d,stroke:#22c55e,stroke-width:2px,color:#fff
style DATOS fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#fff
style EXTERNOS fill:#7c2d12,stroke:#f97316,stroke-width:2px,color:#fff

style Paciente fill:#075985,stroke:#38bdf8,color:#fff
style Admision fill:#075985,stroke:#38bdf8,color:#fff
style Medico fill:#075985,stroke:#38bdf8,color:#fff
style AdminTI fill:#075985,stroke:#38bdf8,color:#fff

style Web fill:#312e81,stroke:#a5b4fc,color:#fff
style API fill:#312e81,stroke:#a5b4fc,color:#fff

style Usuarios fill:#15803d,stroke:#4ade80,color:#fff
style Pacientes fill:#15803d,stroke:#4ade80,color:#fff
style Citas fill:#166534,stroke:#86efac,stroke-width:2px,color:#fff
style Atenciones fill:#15803d,stroke:#4ade80,color:#fff
style Resultados fill:#15803d,stroke:#4ade80,color:#fff
style Notificaciones fill:#15803d,stroke:#4ade80,color:#fff
style Auditoria fill:#14532d,stroke:#6ee7b7,color:#fff

style BD fill:#92400e,stroke:#fde68a,color:#fff
style Cache fill:#92400e,stroke:#fde68a,color:#fff
style Storage fill:#92400e,stroke:#fde68a,color:#fff

style RENIEC fill:#9a3412,stroke:#fdba74,color:#fff
style EmailSMS fill:#9a3412,stroke:#fdba74,color:#fff
style FirmaDigital fill:#9a3412,stroke:#fdba74,color:#fff
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
