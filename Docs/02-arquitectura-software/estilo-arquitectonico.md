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

![Estilo Arquitectónico Monolito Modular con Workers](../../Img/img_estilo_monolito.svg)

```mermaid
flowchart TD

subgraph CLIENTE["CANAL DE ACCESO"]
    SPA["Aplicación Web Hospitalaria (SPA)"]
end

subgraph MONOLITO["BACKEND: MONOLITO MODULAR HRA (Un solo proceso)"]
    API["API REST Gateway / Controladores"]
    
    subgraph MODULOS["Límites Modulares de Dominio"]
        M1["Módulo Identidad y Acceso"]
        M2["Módulo Pacientes"]
        M3["Módulo Citas Médicas"]
        M4["Módulo Atenciones Clínicas"]
        M5["Módulo Diagnósticos"]
        M6["Módulo Notificaciones"]
        M7["Módulo Auditoría"]
    end
end

subgraph ASINCRONO["PROCESAMIENTO ASÍNCRONO"]
    Worker["Workers en Segundo Plano (PDFs y Avisos)"]
end

subgraph DATOS["PERSISTENCIA Y CACHÉ"]
    BD[("Base de Datos Relacional PostgreSQL")]
    Cache[("Caché en Memoria Redis")]
end

SPA -->|HTTPS| API
API --> MODULOS
MODULOS --> BD
MODULOS --> Cache
MODULOS -.->|Encola tareas| Worker
Worker --> BD

style CLIENTE fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#fff
style MONOLITO fill:#0f172a,stroke:#22c55e,stroke-width:2px,color:#fff
style MODULOS fill:#1e293b,stroke:#64748b,stroke-dasharray: 5 5,color:#fff
style ASINCRONO fill:#1e293b,stroke:#a855f7,stroke-width:2px,color:#fff
style DATOS fill:#1e293b,stroke:#fbbf24,stroke-width:2px,color:#fff

style SPA fill:#1e3a8a,stroke:#38bdf8,color:#fff
style API fill:#312e81,stroke:#818cf8,color:#fff
style M1 fill:#14532d,stroke:#4ade80,color:#fff
style M2 fill:#14532d,stroke:#4ade80,color:#fff
style M3 fill:#14532d,stroke:#4ade80,color:#fff
style M4 fill:#14532d,stroke:#4ade80,color:#fff
style M5 fill:#14532d,stroke:#4ade80,color:#fff
style M6 fill:#14532d,stroke:#4ade80,color:#fff
style M7 fill:#14532d,stroke:#4ade80,color:#fff
style Worker fill:#581c87,stroke:#c084fc,color:#fff
style BD fill:#78350f,stroke:#fbbf24,color:#fff
style Cache fill:#78350f,stroke:#fbbf24,color:#fff
```
