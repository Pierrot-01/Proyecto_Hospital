# Atributos de Calidad (Requisitos No Funcionales)

| Atributo | Especificación |
|---|---|
| **Rendimiento / Escalabilidad** | Soportar base de 10,000 usuarios registrados y 1,000 concurrentes. Tiempos de respuesta menores a 3 segundos (percentil 95) para consultas de lectura. |
| **Disponibilidad / Recuperación** | Disponibilidad del 99%. Respaldos con RPO máximo de 24 horas (mejorado con WAL Archiving para PITR a nivel arquitectónico). |
| **Seguridad / Privacidad** | Autenticación segura, rate limiting, cierre automático de sesiones, cifrado de credenciales, auditoría de accesos. Cumplimiento de la Ley N.º 29733 de Protección de Datos Personales. |
| **Concurrencia / Integridad** | Reserva atómica (evitar cruce de citas). Claves de idempotencia para solicitudes duplicadas. |
| **Interoperabilidad** | Uso de estándares sanitarios como HL7 FHIR (conceptual) para estructurar datos de pacientes, solicitudes y resultados. |
| **Mantenibilidad / Extensibilidad** | Arquitectura modular (DDD). Desacoplamiento entre Citas, Resultados, Notificaciones e Identidad. |
