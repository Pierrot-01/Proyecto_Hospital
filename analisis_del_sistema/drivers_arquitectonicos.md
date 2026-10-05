# Drivers Arquitectónicos

Los requerimientos más críticos que han forzado las decisiones de diseño del sistema.

| Driver | Problema a Resolver | Estrategia Adoptada |
|---|---|---|
| **Integridad Transaccional (La Doble Reserva)** | Evitar que dos pacientes reserven el mismo turno. | Locks temporales en caché (Redis `SETNX`) + Restricciones físicas en BD (PostgreSQL EXCLUDE Constraints). |
| **Disponibilidad de Datos (RPO Estricto)** | Un backup diario perdería mucha información hospitalaria en caso de caída. | Implementación de **WAL Archiving** (Point-In-Time Recovery) en PostgreSQL. |
| **Seguridad y Privacidad Clínica** | Riesgo de fuga de información y diagnósticos médicos (Ley 29733). | **KMS** para Cifrado en Reposo (Encryption at Rest) en DB y Object Storage. |
| **Alta Concurrencia (Lecturas)** | 1000 usuarios buscando médicos ralentizan la BD transaccional. | Implementación del patrón **CQRS** (separación de lecturas y escrituras). |
| **Desacoplamiento de Procesos Pesados** | Envío de correos y notificaciones traba el servidor de API. | **Procesamiento Asíncrono** usando RabbitMQ/Redis Streams y workers en segundo plano. |
