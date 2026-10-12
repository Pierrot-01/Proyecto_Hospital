# Drivers arquitectónicos

Los **drivers arquitectónicos** identificados para el sistema son los siguientes:

| ID | Driver arquitectónico | Origen | ¿Por qué influye en la arquitectura? |
|---|---|---|---|
| DA01 | El sistema debe mantener tiempos de respuesta adecuados durante alta concurrencia y soportar un incremento progresivo de usuarios. | AC01 – Rendimiento; AC02 – Escalabilidad | Puede influir en la estrategia de escalamiento, replicación, gestión de conexiones y procesamiento eficiente de consultas. |
| DA02 | El sistema debe garantizar una sola reserva confirmada por cupo ante solicitudes concurrentes. | AC05 – Integridad | Exige restricciones y transacciones SQL con controles de unicidad e idempotencia en la capa de persistencia. |
| DA03 | El sistema debe proteger los datos de pacientes, resultados diagnósticos y operaciones sensibles frente a accesos no autorizados. | AC04 – Seguridad | Influye en autenticación, autorización por recurso, cifrado, auditoría y mínimo privilegio. |
| DA04 | El sistema debe almacenar documentos PDF e imágenes diagnósticas de forma separada de los datos transaccionales. | RC06 – Sin PACS/DICOM; AC01 – Rendimiento | Condiciona el uso de almacenamiento de objetos compatible S3, separado de la base de datos relacional. |
| DA05 | Las fallas en servicios de notificación no deben invalidar operaciones principales ya confirmadas. | AC06 – Confiabilidad | Influye en el procesamiento asíncrono por eventos, con persistencia y reintentos controlados. |
| DA06 | El sistema debe permitir modificar funcionalidades sin afectar innecesariamente otros módulos. | AC07 – Mantenibilidad | Influye en la separación de responsabilidades, modularidad, límites de módulos, Clean Architecture y pruebas independientes. |
| DA07 | El sistema debe contar con respaldos y procedimientos comprobables de restauración. | AC09 – Recuperación | Influye en la estrategia de copias de respaldo, RPO, RTO y verificación de integridad. |
