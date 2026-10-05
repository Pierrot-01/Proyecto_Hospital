# Requisitos del Sistema

Este directorio contiene la documentación relacionada con los requisitos del **Sistema Web para la Gestión de Citas Médicas y Resultados**.

## Tipos de Requisitos

- **Requisitos Funcionales:** 
  - Gestión de citas médicas (agendamiento, cancelación).
  - Entrega segura de resultados de laboratorio e informes diagnósticos.
  - Visualización de horarios y disponibilidad de médicos.

- **Requisitos No Funcionales (Restricciones Generales):**
  - **Concurrencia:** Soporte para 10,000 usuarios registrados y hasta 1,000 usuarios simultáneos.
  - **Seguridad y Privacidad:** Cumplimiento de la Ley N.º 29733 (Ley de Protección de Datos Personales).
  - **Integridad:** Matemáticamente imposible registrar dos citas para un mismo doctor en el mismo horario.

> **Nota:** Aquí se irán detallando progresivamente los casos de uso, historias de usuario y flujos del sistema.
