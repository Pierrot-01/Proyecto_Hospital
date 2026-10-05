# Enfoque Arquitectónico

**Enfoque Seleccionado:** Clean Architecture (Arquitectura Limpia) complementado con el patrón CQRS (Separación de Responsabilidades de Comandos y Consultas).

## Descripción Arquitectónica
A nivel micro, la estructura interna del código obedece a la "Regla de Dependencia Inversa". El sistema se organiza en capas concéntricas donde el **Dominio** (que contiene las entidades y estrictas reglas clínicas) reside en el centro, totalmente agnóstico a la tecnología externa. 

Para resolver el problema del exceso de procesamiento (*sobreingeniería*) en operaciones sencillas, se ha integrado el patrón **CQRS**. El flujo de la aplicación se bifurca en dos caminos:
* **Comandos (Escritura):** Operaciones críticas (ej. *Reservar Cita* o *Publicar Diagnóstico*) atraviesan estrictamente la barrera del Dominio para ser validadas por las reglas médicas.
* **Consultas (Lectura):** Operaciones de alto volumen (ej. *Listar Especialidades*) realizan un *bypass* del Dominio, leyendo directamente desde la infraestructura para maximizar el rendimiento.

## Justificación Técnica
1. **Seguridad Clínica (Clinical Safety):** Aislar las reglas médicas en el núcleo asegura que vulnerabilidades o cambios en tecnologías externas (como una actualización del framework Express, o el cambio de almacenamiento a AWS S3) jamás alteren la integridad lógica de un diagnóstico validado.
2. **Interoperabilidad Estándar:** La capa de Adaptadores actúa como una barrera anticorrupción, permitiendo utilizar mapeadores (DTOs) para traducir la información interna a estándares mundiales de salud (como HL7 FHIR), preparando al hospital para integraciones gubernamentales (MINSA/SIS).
3. **Rendimiento Optimizado:** La inclusión de CQRS permite que el sistema entregue vistas de lectura en milisegundos, reservando el procesamiento pesado únicamente para cuando el usuario realiza una modificación real de los datos.

## Diagrama del Enfoque Arquitectónico

```mermaid
flowchart LR
    %% Definición de Colores
    classDef pres fill:#e3f2fd,stroke:#1565c0,stroke-width:1px;
    classDef app fill:#e8f5e9,stroke:#2e7d32,stroke-width:1px;
    classDef dom fill:#fff8e1,stroke:#f57f17,stroke-width:2px;
    classDef infra fill:#f3e5f5,stroke:#6a1b9a,stroke-width:1px;
    classDef ext fill:#f5f5f5,stroke:#616161,stroke-width:1px;
    classDef leg fill:#ffffff,stroke:#000000,stroke-width:1px;

    Usuario([Cliente HTTP]) -.-> Presentacion

    subgraph ArquitecturaClean ["ADAPTADORES Y APLICACIÓN"]
        
        subgraph Presentacion ["PRESENTACIÓN"]
            direction TB
            Ctrl["Controladores REST"]:::pres
            DTOs["Mappers / DTOs (FHIR)"]:::pres
        end
        
        subgraph AppCQRS ["APLICACIÓN (CQRS)"]
            direction TB
            Comandos["COMANDOS (Escritura)\nEj: ReservarCitaCommand"]:::app
            Consultas["CONSULTAS (Lectura)\nEj: ListarCitasQuery"]:::app
        end
        
        subgraph Dom ["DOMINIO (Seguridad Clínica)"]
            direction LR
            Entidades["Entidades:\nCita, Resultado"]:::dom
            Reglas["Reglas Médicas:\nValidaciones estrictas"]:::dom
        end
        
        subgraph Infra ["INFRAESTRUCTURA"]
            direction TB
            RepoSQL["Repositorios PostgreSQL"]:::infra
            RepoS3["Repositorios MinIO"]:::infra
            EventPub["Publishers RabbitMQ"]:::infra
        end

        %% Flujo de Comandos
        Presentacion -->|1. Ejecuta Comando| Comandos
        Comandos -->|2. Valida reglas| Dom
        Infra -.->|3. Implementa contrato| Comandos

        %% Flujo de Consultas
        Presentacion -.->|Bypass de Lectura Rápida| Consultas
        Infra -.->|Implementa lectura| Consultas
    end

    %% Sistemas Externos
    PG[(PostgreSQL)]:::ext
    S3[(MinIO)]:::ext
    
    RepoSQL --> PG
    Consultas -.->|SQL Directo Alta Performance| PG
    RepoS3 --> S3

    %% Leyenda
    subgraph Leyenda ["Leyenda y Reglas CQRS"]
        direction TB
        L1["Línea Sólida: Operación crítica (atraviesa el Dominio)"]:::leg
        L2["Línea Punteada: Consulta de lectura rápida (Bypass)"]:::leg
        L3["Regla: Solo la escritura ejecuta validaciones clínicas complejas"]:::leg
    end
```
