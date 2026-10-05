# Decisiones Arquitectónicas

| Componente / Patrón | Tecnología / Decisión | Justificación |
|---|---|---|
| **Estilo Arquitectónico Macro** | Monolito Modular Orientado a Eventos | Evita la complejidad prematura de microservicios, pero usa DDD para mantener módulos independientes y listos para extraerse. |
| **Estilo Arquitectónico Micro** | Clean Architecture + CQRS | Separa las reglas de negocio clínicas del framework (Clean) y optimiza las lecturas frente a las escrituras (CQRS). |
| **Capa de Aplicación Web** | Node.js (Express / Fastify) (Stateless) | Permite alta escalabilidad horizontal detrás de un balanceador de carga. |
| **Base de Datos Relacional** | PostgreSQL | Fuerte consistencia ACID, manejo de concurrencia avanzado (GiST). |
| **Gestión de Caché y Locks** | Redis | Acelera consultas repetitivas y maneja bloqueos temporales ultrarrápidos para concurrencia. |
| **Almacenamiento de Archivos** | MinIO (Object Storage) | Almacenamiento seguro, escalable y compatible con S3 para PDFs e imágenes médicas. |
| **Broker de Mensajería** | RabbitMQ / Redis Streams | Permite enviar tareas en segundo plano (notificaciones, auditoría asíncrona). |
| **Infraestructura** | Docker y Docker Compose | Empaquetado estandarizado para despliegue y pruebas del MVP sin dependencia del SO base. |
