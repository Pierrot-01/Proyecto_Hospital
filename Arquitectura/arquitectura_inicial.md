# Arquitectura Inicial del Sistema

El siguiente diagrama representa la arquitectura de alto nivel de la solución (Modelo C4 - Nivel 2: Contenedores). 
El flujo parte de dos puntos de acceso web adaptables, pasando por un balanceador de carga hacia múltiples instancias del servidor de aplicación (*backend stateless*). Los datos se almacenan de manera segregada según su naturaleza y se utilizan colas de mensajería para desacoplar el procesamiento asíncrono.

## Diagrama de la Arquitectura Inicial

```mermaid
flowchart TD
    %% Usuarios
    User1([Personal de Salud / Admin\nPanel Web Hospital])
    User2([Paciente / Representante\nPortal Web Responsive])

    %% Perímetro
    subgraph Perimetro ["Perímetro y Distribución"]
        WAF{{"Balanceador de Carga / WAF\n(HTTPS :443)"}}
    end

    User1 --> WAF
    User2 --> WAF

    %% Aplicación
    subgraph App ["Servidores de Aplicación (Backend Stateless)"]
        direction LR
        API1["Servidor API - Instancia 1\n(Puerto :3001)"]
        API2["Servidor API - Instancia 2\n(Puerto :3002)"]
    end

    WAF --> API1
    WAF --> API2

    %% Procesamiento y Datos
    subgraph Infra ["Capa de Datos, Almacenamiento y Auditoría"]
        direction TB
        
        DB1[(PostgreSQL Primario\nEscritura / Transaccional)]
        DB2[(PostgreSQL Réplica\nLecturas y Reportes)]
        
        Cache[(Caché Redis\nTurnos y Sesiones)]
        
        Storage[(Object Storage S3 / MinIO\nInformes PDF e Imágenes Web)]
        
        Broker[["Broker de Eventos / Colas\n(Redis Streams / RabbitMQ)"]]
        
        Audit[("Bitácora de Auditoría 5W")]
        
        DB1 -.->|Replicación| DB2
    end

    %% Conexiones Backend -> Infraestructura
    API1 <--> Cache
    API2 <--> Cache
    
    API1 --> DB1
    API2 --> DB1
    API1 -.-> DB2
    API2 -.-> DB2
    
    API1 --> Storage
    API2 --> Storage
    
    API1 --> Broker
    API2 --> Broker
    
    %% Workers
    subgraph Workers ["Procesamiento Asíncrono"]
        WorkerNotif["Worker de Notificaciones\n(Background Task)"]
    end

    Broker --> WorkerNotif
    Broker --> Audit
    
    %% Externo
    EmailService[/"Email / Webhook / Mensajería"\]
    WorkerNotif --> EmailService
```
