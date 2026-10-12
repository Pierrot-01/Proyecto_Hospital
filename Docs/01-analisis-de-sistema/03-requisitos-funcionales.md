# Requisitos funcionales

## Requisitos funcionales

| ID | Requisito funcional |
|---|---|
| RF01 | El sistema debe permitir registrar y activar pacientes sin cuentas duplicadas. |
| RF02 | El sistema debe permitir autenticación y autorización según roles y recursos asignados. |
| RF03 | El sistema debe permitir consultar disponibilidad de citas por especialidad, profesional y fecha. |
| RF04 | El sistema debe permitir reservar cupos con prevención de doble asignación concurrente. |
| RF05 | El sistema debe permitir reprogramar y cancelar citas de forma consistente. |
| RF06 | El sistema debe permitir registrar solicitudes y resultados de laboratorio asociados al paciente. |
| RF07 | El sistema debe permitir adjuntar informes PDF e imágenes representativas permitidas a estudios diagnósticos. |
| RF08 | El sistema debe permitir la validación y autorización de publicación de resultados por un profesional competente. |
| RF09 | El sistema debe permitir consultar y descargar de forma segura los resultados publicados. |
| RF10 | El sistema debe enviar notificaciones asíncronas de citas y resultados. |
| RF11 | El sistema debe permitir administrar servicios, especialidades, horarios, roles y permisos. |
| RF12 | El sistema debe registrar auditoría de accesos y modificaciones relevantes. |
| RF13 | El sistema debe permitir la representación de pacientes con autorización verificable y revocable. |

---

## Relación entre historias de usuario y requisitos funcionales

| Historia de usuario | Requisitos funcionales relacionados |
|---|---|
| HU01 Consultar disponibilidad | RF03 |
| HU02 Reservar, reprogramar y cancelar citas | RF04, RF05 |
| HU03 Consultar y descargar resultados | RF09 |
| HU04 Registrar y buscar pacientes (admisión) | RF01 |
| HU05 Registrar resultados de laboratorio | RF06 |
| HU06 Asociar informes a estudios de imágenes | RF07 |
| HU07 Validar informes antes de publicación | RF08 |
| HU08 Gestionar especialidades, horarios, roles | RF11 |
| HU09 Recibir avisos de citas y resultados | RF10 |
| HU10 Representante consulta citas y resultados | RF02, RF09, RF13 |
| HU11 Solicitar representación autorizada | RF13 |
| HU12 Revocar representación | RF13 |
| HU13 Consultar registros de auditoría | RF02, RF12 |
