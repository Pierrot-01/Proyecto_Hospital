# Estilo Arquitectónico

**Estilo Seleccionado:** Monolito Modular Orientado a Eventos (basado en *Domain-Driven Design*).

## Descripción Arquitectónica
La arquitectura a nivel macro se ha diseñado bajo un modelo de despliegue centralizado (*backend stateless*) escalable horizontalmente a través de un Balanceador de Carga (WAF). Para gestionar la complejidad del sector salud sin comprometer la consistencia de los datos, el sistema rechaza la fragmentación extrema de los microservicios y opta por **Contextos Delimitados (Bounded Contexts)**. Internamente, el código opera en módulos lógicos estrictamente aislados (Identidad, Citas Médicas, Diagnósticos), pero que comparten una única base de datos transaccional.

Adicionalmente, se integra un diseño **Orientado a Eventos** mediante un Message Broker (RabbitMQ), aislando los procesos principales de las tareas secundarias (como el envío de notificaciones y el registro de auditoría), garantizando así una alta disponibilidad.

## Justificación Técnica
1. **Consistencia ACID Crítica:** En un entorno hospitalario, la pérdida de sincronización de datos es un riesgo clínico inaceptable. Al centralizar la persistencia en PostgreSQL (apoyado por índices *EXCLUDE* y *WAL Archiving*), se garantiza la atomicidad de operaciones críticas, como evitar el cruce de horarios en citas médicas (*double-booking*).
2. **Resiliencia y Rendimiento:** La integración de Redis absorbe la carga de control de concurrencia temporal, mientras que RabbitMQ expulsa del hilo principal las tareas propensas a fallos por red (ej. envío de SMS/Emails), asegurando que el paciente siempre reciba una respuesta rápida.

## Diagrama del Estilo Arquitectónico

```mermaid
flowchart TD
    %% Definición de Colores
    classDef ctx fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef pres fill:#e3f2fd,stroke:#1565c0,stroke-width:1px;
    classDef dat fill:#fff3e0,stroke:#e65100,stroke-width:1px;
    classDef ext fill:#f5f5f5,stroke:#616161,stroke-width:1px;
    classDef leg fill:#ffffff,stroke:#000000,stroke-width:1px;

    %% Actores
    Pac[Paciente] --- Web[Cliente Web Hospital]
    Med[Personal Médico] --- Web

    Web -.->|HTTPS / JSON| WAF{WAF / Balanceador}

    subgraph Backend ["«monolito» Backend Hospitalario (Despliegue Único)"]
        MW["Middlewares / API Gateway Interno\n(Auth, KMS, Validación)"]:::pres
        
        subgraph BoundedContexts ["Contextos Delimitados (Domain-Driven Design)"]
            direction LR
            CtxPac["Contexto: Identidad\n(Pacientes y Roles)"]:::ctx
            CtxCit["Contexto: Citas Médicas\n(Agendas y Bloqueos Redis)"]:::ctx
            CtxRes["Contexto: Diagnósticos\n(Informes y Archivos)"]:::ctx
        end
        
        MW --> CtxPac
        MW --> CtxCit
        MW --> CtxRes
    end

    %% Persistencia
    DB[(PostgreSQL - ACID\nEsquemas separados por contexto)]:::dat
    Cache[(Redis\nBloqueos Distribuidos)]:::ext
    S3[(MinIO\nPDFs Clínicos)]:::ext
    
    CtxCit <--> Cache
    CtxCit --> DB
    CtxPac --> DB
    CtxRes --> DB
    CtxRes --> S3

    %% Eventos Asíncronos
    Broker{{"Broker de Eventos\n(RabbitMQ)"}}:::ext
    CtxCit -- "Evento: CitaReservada" --> Broker
    CtxRes -- "Evento: ResultadoPublicado" --> Broker
    
    Broker --> WorkerNotif["Worker: Notificaciones (Email)"]:::ext
    Broker --> WorkerAudit["Worker: Auditoría Médica"]:::ext

    %% Leyenda
    subgraph Leyenda ["Leyenda y Reglas Macro"]
        direction TB
        L1["Contextos Delimitados: Cada módulo maneja sus propios datos lógicos"]:::leg
        L2["Transacciones ACID: Aseguradas por DB compartida"]:::leg
        L3["Alta Disponibilidad: Asincronía para operaciones no críticas"]:::leg
    end
```
