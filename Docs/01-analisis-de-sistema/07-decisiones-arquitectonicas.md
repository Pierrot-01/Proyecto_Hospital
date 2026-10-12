# Decisiones arquitectónicas

| ID | Decisión arquitectónica | Driver relacionado | Justificación | Resultado |
|---|---|---|---|---|
| ADR-001 | Monolito modular + workers | DA01 – Rendimiento; DA06 – Mantenibilidad | Mantener integridad transaccional simple y facilitar desarrollo y evolución controlada. El volumen esperado no obliga a microservicios. | Backend monolítico organizado en módulos: Identidad, Citas, Laboratorio, Imágenes, Notificaciones, Auditoría, Administración. Workers para tareas asíncronas. |
| ADR-002 | Spring Boot + Spring Modulith | DA06 – Mantenibilidad | Delimitar módulos con verificación automática de dependencias entre ellos. | Módulos con límites comprobables y comunicación controlada. |
| ADR-003 | Clean Architecture | DA06 – Mantenibilidad | Separar las reglas del negocio de los detalles tecnológicos (frameworks, BD, servicios externos). | Capas de Dominio, Aplicación, Infraestructura y Presentación dentro de cada módulo. |
| ADR-004 | PostgreSQL y transacciones ACID | DA02 – Integridad | Evitar reservas duplicadas con restricciones de unicidad, exclusión y transacciones persistentes. | Base de datos relacional con controles SQL específicos para concurrencia de cupos. |
| ADR-005 | Autorización por objeto y auditoría | DA03 – Seguridad | Proteger informes de pacientes verificando permisos sobre cada recurso y registrando acciones sensibles. | Spring Security con autorización por recurso, mínimo privilegio y trazas de auditoría. |
| ADR-006 | Documentos privados en almacenamiento de objetos | DA04 – Documentos | Mantener PDFs e imágenes diagnósticas fuera de tablas transaccionales para no afectar rendimiento ni tamaño de la BD. | Almacenamiento compatible S3, acceso mediante comprobación de permisos y enlaces de vigencia limitada. |
| ADR-007 | Eventos y notificación asíncrona | DA05 – Confiabilidad | Las fallas de envío de correo o SMS no deben interrumpir operaciones confirmadas. | Eventos Spring Modulith con persistencia y reintentos controlados. |
| ADR-008 | REST / OpenAPI; FHIR conceptual | DA03 – Seguridad; DA06 – Mantenibilidad | Interfaces bien definidas, documentadas y preparadas para interoperabilidad futura. | API REST documentada con OpenAPI. Modelo de datos compatible conceptualmente con HL7 FHIR. |
| ADR-009 | Pruebas de carga y observabilidad | DA01 – Rendimiento | Medir latencia, errores y saturación antes de escalar. No asumir capacidad sin evidencia. | k6 para pruebas de carga; Actuator, Micrometer y OpenTelemetry para métricas y trazas. |
