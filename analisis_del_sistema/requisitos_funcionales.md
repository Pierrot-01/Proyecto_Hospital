# Requisitos Funcionales

| Proceso | Requerimiento (Resumen) |
|---|---|
| **Gestión de Citas** | - Consultar disponibilidad por especialidad/médico.<br>- Programar, visualizar, reprogramar y cancelar citas.<br>- Impedir doble asignación de horarios.<br>- Evitar duplicidad por reintentos. |
| **Resultados y Estudios** | - Registrar resultados de laboratorio y radiología.<br>- Adjuntar informes PDF e imágenes.<br>- Flujo de estados: registrado -> pendiente de validación -> validado -> publicado.<br>- Descarga exclusiva por el paciente autorizado. |
| **Identidad y Cuentas** | - Autorregistro web y activación asistida.<br>- Evitar cuentas duplicadas con diferentes documentos (DNI, CE, Pasaporte).<br>- Soporte para representantes legales (padres/tutores). |
| **Notificaciones** | - Enviar avisos por confirmación o cancelación de citas.<br>- Enviar recordatorios automáticos.<br>- Notificar publicación de resultados (sin incluir datos sensibles). |
| **Administración** | - Gestión de usuarios mediante RBAC.<br>- Auditoría inmutable de accesos y modificaciones (5W). |
