# Escenarios de atributos de calidad del sistema HRA

## EQ-01. Rendimiento: consulta de disponibilidad y citas

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Rendimiento |
| **Fuente** | Paciente |
| **Estímulo** | El paciente consulta disponibilidad de citas o accede a la lista de sus citas programadas. |
| **Condición** | El sistema funciona en horario normal con carga representativa de usuarios. |
| **Respuesta esperada** | El sistema muestra los resultados de disponibilidad o la lista de citas sin errores inesperados. |
| **Medida** | **Propuesta por validar:** el 95 % de las consultas responde en 3 segundos o menos (p95 ≤ 3 s), con menos del 1 % de errores técnicos, durante una prueba con 200 usuarios simultáneos. |
| **Verificación** | Ejecutar pruebas de carga con k6, registrar tiempos de respuesta, errores y cantidad de usuarios simultáneos. |
| **Estado** | Pendiente de aprobación de las medidas y definición del entorno de prueba. |

## EQ-02. Escalabilidad: incremento progresivo de usuarios

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Escalabilidad |
| **Fuente** | Incremento de solicitudes de los pacientes |
| **Estímulo** | Aumenta la cantidad de usuarios que acceden al sistema simultáneamente (100 → 500 → 1 000). |
| **Condición** | Se realiza una prueba de carga con datos, configuración y solicitudes documentados. |
| **Respuesta esperada** | El sistema soporta el aumento de usuarios sin superar los límites acordados de tiempo de respuesta y errores. |
| **Medida** | **Propuesta por validar:** soportar hasta 1 000 usuarios simultáneos, con el 95 % de las respuestas por debajo de 3 segundos y menos del 1 % de errores técnicos. |
| **Verificación** | Aumentar progresivamente la carga con k6 y comparar los tiempos de respuesta, los errores, CPU, RAM y conexiones. |
| **Estado** | Pendiente de confirmar la cantidad esperada de usuarios y la infraestructura de prueba. |

## EQ-03. Disponibilidad: continuidad del servicio

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Disponibilidad |
| **Fuente** | Paciente |
| **Estímulo** | El paciente intenta realizar una operación durante el horario de atención o cuando ocurre una falla en un componente. |
| **Condición** | El sistema está publicado y cuenta con monitoreo (Actuator, Micrometer). |
| **Respuesta esperada** | El sistema mantiene disponibles las operaciones que puede atender y comunica los errores de forma controlada cuando un servicio necesario no responde. |
| **Medida** | **Propuesta por validar:** disponibilidad mensual de 99 % durante el horario definido para las operaciones críticas. |
| **Verificación** | Revisar los registros de monitoreo y calcular los periodos de disponibilidad e interrupción. |
| **Estado** | Pendiente de aprobar la meta, definir las operaciones críticas y establecer las condiciones de mantenimiento. |

## EQ-04. Seguridad: acceso a resultados protegidos

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Seguridad |
| **Fuente** | Usuario sin sesión, con credenciales inválidas, sin permisos suficientes o intentando acceder a datos de otro paciente |
| **Estímulo** | El usuario intenta acceder a un informe diagnóstico de un paciente ajeno o realizar una operación no autorizada. |
| **Condición** | Se realizan pruebas sobre las funciones protegidas del sistema. |
| **Respuesta esperada** | El sistema rechaza la operación, no ejecuta el cambio solicitado, no expone información sensible y registra el intento en auditoría. |
| **Medida** | Rechazar el 100 % de los intentos no autorizados incluidos en las pruebas definidas, sin exposición de datos sensibles en las respuestas revisadas. Cada intento debe quedar registrado en la traza de auditoría. |
| **Verificación** | Ejecutar pruebas de acceso autorizado y no autorizado, revisar las respuestas y comprobar los registros de auditoría. |
| **Estado** | Pendiente de definir los permisos por tipo de usuario y las operaciones protegidas. |

## EQ-05. Integridad: reserva concurrente de cupos

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Integridad |
| **Fuente** | Múltiples pacientes |
| **Estímulo** | 100 solicitudes simultáneas intentan reservar el mismo cupo de cita médica. |
| **Condición** | Se ejecuta una prueba de concurrencia controlada con k6 sobre el endpoint de reserva. |
| **Respuesta esperada** | Solo una reserva es confirmada exitosamente. Las demás solicitudes reciben una respuesta de conflicto coherente (HTTP 409). |
| **Medida** | Exactamente una confirmación válida por cupo. El resto reciben respuestas de conflicto sin datos corruptos ni reservas duplicadas. |
| **Verificación** | Ejecutar la prueba de cupo disputado, verificar en base de datos que existe una sola reserva, revisar que las respuestas de conflicto sean coherentes. |
| **Estado** | Pendiente de implementar restricciones de unicidad/exclusión en PostgreSQL y definir el escenario exacto de la prueba. |

## EQ-06. Confiabilidad: fallo en servicio de notificaciones

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Confiabilidad |
| **Fuente** | Servicio de correo no disponible |
| **Estímulo** | El paciente confirma una reserva de cita, pero el servicio de correo electrónico no responde. |
| **Condición** | El sistema está operando normalmente pero el servicio externo de notificaciones presenta una falla. |
| **Respuesta esperada** | La cita queda confirmada correctamente. El evento de notificación se persiste y queda pendiente de reintento automático. |
| **Medida** | La reserva se completa exitosamente. El evento pendiente se reintenta y se entrega cuando el servicio de correo se restablece. |
| **Verificación** | Simular la caída del servicio de correo durante una reserva, verificar que la cita queda confirmada en BD y que el evento se reintenta al restaurar el servicio. |
| **Estado** | Pendiente de definir la estrategia de reintentos (cantidad máxima, intervalos) y el mecanismo de persistencia de eventos. |

## EQ-07. Mantenibilidad: cambio de módulo sin afectar otros

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Mantenibilidad |
| **Fuente** | Equipo de desarrollo |
| **Estímulo** | Se modifica una regla de negocio en el módulo de Citas o se necesita cambiar el proveedor de almacenamiento de documentos. |
| **Condición** | El sistema está organizado en módulos con Clean Architecture y dispone de pruebas para las funciones afectadas. |
| **Respuesta esperada** | El cambio se concentra en el módulo responsable sin afectar funciones no relacionadas, salvo que exista una dependencia justificada. |
| **Medida** | Las pruebas del módulo modificado y las pruebas de regresión acordadas deben aprobarse. Las dependencias entre módulos deben respetar las reglas de arquitectura de Spring Modulith. |
| **Verificación** | Revisar los cambios de código, ejecutar las pruebas unitarias e inspeccionar las dependencias entre módulos con Spring Modulith. |
| **Estado** | Pendiente de definir las reglas de dependencias y las pruebas obligatorias para los cambios. |

## EQ-08. Accesibilidad: uso desde dispositivos móviles

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Accesibilidad |
| **Fuente** | Paciente desde un teléfono móvil con conexión limitada |
| **Estímulo** | El paciente accede a la plataforma desde un navegador móvil para consultar o reservar una cita. |
| **Condición** | La interfaz está publicada y es accesible vía HTTPS. |
| **Respuesta esperada** | La interfaz se adapta al tamaño de pantalla y es navegable sin scroll horizontal. Los elementos interactivos son usables con toque. |
| **Medida** | La interfaz cumple criterios WCAG 2.2 nivel AA. Las páginas principales son funcionales en viewports de 360 px en adelante. |
| **Verificación** | Ejecutar auditoría de accesibilidad con herramientas automatizadas y pruebas manuales en dispositivos representativos. |
| **Estado** | Pendiente de definir las páginas prioritarias y los dispositivos de prueba. |

## EQ-09. Recuperación: restauración desde respaldo

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Recuperación |
| **Fuente** | Fallo catastrófico o corrupción de datos |
| **Estímulo** | Se necesita restaurar el sistema completo desde un respaldo reciente. |
| **Condición** | El sistema cuenta con copias de respaldo automatizadas y documentación del procedimiento de restauración. |
| **Respuesta esperada** | El sistema se restaura con la información íntegra hasta el último respaldo válido. |
| **Medida** | **Propuesta por validar:** RPO y RTO definidos y acordados antes del despliegue institucional. Verificación de integridad y tiempo de restauración medibles. |
| **Verificación** | Ejecutar un simulacro de restauración desde respaldo, medir el tiempo total y verificar la integridad de los datos restaurados. |
| **Estado** | Pendiente de definir RPO, RTO y la estrategia de respaldo (frecuencia, retención, ubicación). |

---

## Resumen de escenarios

| Código | Atributo de calidad | Qué se busca comprobar |
|---|---|---|
| EQ-01 | Rendimiento | Que el sistema responda dentro del tiempo establecido bajo carga. |
| EQ-02 | Escalabilidad | Que el sistema soporte un aumento de usuarios dentro de los límites definidos. |
| EQ-03 | Disponibilidad | Que las operaciones críticas estén disponibles cuando se necesiten. |
| EQ-04 | Seguridad | Que los resultados protegidos no puedan accederse sin autorización. |
| EQ-05 | Integridad | Que un cupo disputado produzca exactamente una reserva válida. |
| EQ-06 | Confiabilidad | Que una falla de notificación no invalide una reserva confirmada. |
| EQ-07 | Mantenibilidad | Que los cambios puedan realizarse sin afectar innecesariamente otros módulos. |
| EQ-08 | Accesibilidad | Que la interfaz sea usable desde dispositivos móviles. |
| EQ-09 | Recuperación | Que el sistema pueda restaurarse desde respaldo con integridad verificada. |
