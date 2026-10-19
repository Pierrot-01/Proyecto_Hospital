# Estilo arquitectónico

Se utiliza el estilo arquitectónico: **monolito modular + workers**.

| Elemento | Descripción aplicada al sistema HRA |
|---|---|
| Estilo arquitectónico | Monolito modular con workers para procesamiento asíncrono. |
| Objetivo | Mantener integridad transaccional simple y facilitar el desarrollo y evolución controlada del sistema. |
| ¿Qué problema resuelve? | Evita la complejidad operativa de microservicios (red, consistencia distribuida, monitoreo) manteniendo la capacidad de evolucionar módulos de forma independiente. |
| Módulos definidos | Identidad y acceso, Citas médicas, Laboratorio, Diagnóstico por imágenes, Notificaciones, Auditoría, Administración, Portal del paciente. |
| Beneficios | • Transacciones ACID directas sin coordinación distribuida. • Operación y despliegue simples. • Los módulos permiten separar a microservicios en el futuro si es necesario. • Workers desacoplan tareas asíncronas sin comprometer las operaciones principales. |

| Alternativa evaluada | Ventajas | Costos y riesgos | Motivo de descarte |
|---|---|---|---|
| Microservicios | Escalamiento y despliegue independientes. | Mayor complejidad de red, monitoreo, consistencia y operación. | Equipo pequeño, plazo acotado, volumen de 1 000 usuarios no lo justifica. |
| Monolito sin modularizar | Desarrollo inicial rápido. | Acoplamiento creciente, difícil de mantener y evolucionar. | No cumple DA06 – Mantenibilidad. |

## Diagrama del estilo arquitectónico: Monolito modular con workers

<!-- imagen #02 — Estilo Arquitectónico: Monolito Modular con Workers -->



```mermaid
flowchart TD

subgraph CLIENTE["CANAL DE ACCESO"]
    SPA["<b>Aplicación Web (SPA)</b><br>Angular 18 / TypeScript<br>Portal de pacientes y personal clínico"]
end

subgraph MONOLITO["BACKEND — MONOLITO MODULAR HRA (Un único proceso desplegable)"]
    API["<b>API REST Gateway</b><br>Entrypoint unificado · JWT · RBAC · Validación DTOs"]

    subgraph MODULOS["Límites Modulares de Dominio — Cada módulo: dominio / aplicación / infraestructura"]
        M1["<b>Identidad y Acceso</b><br>Credenciales, roles y JWT"]
        M2["<b>Pacientes</b><br>Filiación y validación DNI"]
        M3["<b>Citas Médicas</b><br>Agendas, cupos y reserva concurrente"]
        M4["<b>Atenciones Clínicas</b><br>Consultas médicas y evolución"]
        M5["<b>Diagnósticos</b><br>Laboratorio, imágenes y PDFs"]
        M6["<b>Notificaciones</b><br>Correos de confirmación y alertas"]
        M7["<b>Auditoría</b><br>Pistas inmutables — solo INSERT"]
    end
end

subgraph ASINCRONO["PROCESAMIENTO ASÍNCRONO (fuera del hilo HTTP)"]
    Worker["<b>Workers en Segundo Plano</b><br>Generación de PDFs pesados · Despacho masivo SMTP"]
end

subgraph DATOS["PERSISTENCIA Y CACHÉ"]
    BD[("PostgreSQL 16<br>Garantía ACID · Unicidad de cupos")]
    Cache[("Redis 7<br>Candados SET NX EX · Caché de agendas")]
end

SPA -->|"HTTPS · REST + JWT"| API
API -->|"Invocación en memoria por módulo"| MODULOS
MODULOS -->|"SQL transaccional"| BD
M3 -->|"Candado distribuido SET NX EX"| Cache
MODULOS -.-|"Encola tareas asíncronas"| Worker
Worker -->|"Actualiza estado en BD"| BD

style CLIENTE fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#fff
style MONOLITO fill:#0f172a,stroke:#22c55e,stroke-width:2px,color:#fff
style MODULOS fill:#1e293b,stroke:#64748b,stroke-dasharray: 5 5,color:#fff
style ASINCRONO fill:#2e1065,stroke:#a855f7,stroke-width:2px,color:#fff
style DATOS fill:#78350f,stroke:#fbbf24,stroke-width:2px,color:#fff

style SPA fill:#1e3a8a,stroke:#60a5fa,color:#fff
style API fill:#312e81,stroke:#818cf8,color:#fff
style M1 fill:#14532d,stroke:#4ade80,color:#fff
style M2 fill:#14532d,stroke:#4ade80,color:#fff
style M3 fill:#166534,stroke:#86efac,stroke-width:2px,color:#fff
style M4 fill:#14532d,stroke:#4ade80,color:#fff
style M5 fill:#14532d,stroke:#4ade80,color:#fff
style M6 fill:#14532d,stroke:#4ade80,color:#fff
style M7 fill:#14532d,stroke:#6ee7b7,color:#fff
style Worker fill:#4c1d95,stroke:#c084fc,color:#fff
style BD fill:#92400e,stroke:#fde68a,color:#fff
style Cache fill:#92400e,stroke:#fde68a,color:#fff
```
