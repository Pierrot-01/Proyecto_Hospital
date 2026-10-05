# Actores del Sistema

| Actor | Descripción | Responsabilidades / Permisos |
|---|---|---|
| **Paciente / Representante** | Usuario final del sistema que requiere atención médica. | Consultar disponibilidad, agendar/cancelar citas, ver resultados de laboratorio e informes diagnósticos, gestionar accesos. |
| **Personal de Admisión / Citas** | Personal administrativo del hospital. | Gestionar horarios, ayudar con activación presencial, reprogramar citas a nivel interno. |
| **Personal Técnico (Laboratorio / Imágenes)** | Personal encargado de registrar los exámenes. | Subir resultados (PDF/imágenes), cambiar estado a "pendiente de validación". |
| **Médico Validador** | Profesional de la salud autorizado. | Validar los resultados para que sean publicados en el portal del paciente. |
| **Administrador del Sistema** | Encargado de IT. | Administrar usuarios, roles, permisos (RBAC), configurar especialidades, auditar accesos. |
