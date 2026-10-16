# Componentes arquitectónicos

## Módulos del monolito modular

| Componente | Responsabilidad | Funcionalidades principales | Paquete en el código |
|---|---|---|---|
| **API REST** | Punto de entrada HTTP del backend | Rutas `/api/v1`, autenticación JWT, validación de entrada, manejo de errores | `api/` |
| **Identidad y acceso** | Autenticación, roles y permisos | Registro y activación de pacientes, inicio de sesión, roles (paciente, admisión, laboratorio, imágenes, validador, médico, administrador, auditor), representación autorizada | `modules/identidad/` |
| **Citas médicas** | Programación de atenciones | Consulta de disponibilidad, reserva con prevención de doble asignación, reprogramación, cancelación | `modules/citas/` |
| **Laboratorio** | Resultados de análisis clínicos | Registro de solicitudes y resultados, asociación de informes PDF, envío a validación | `modules/laboratorio/` |
| **Diagnóstico por imágenes** | Estudios de imagen | Registro de radiografía, ecografía y tomografía, informes PDF e imágenes representativas, envío a validación | `modules/imagenes/` |
| **Notificaciones** | Comunicación con el paciente | Confirmación de citas, aviso de disponibilidad de resultados, reintentos ante falla del servicio de correo | `modules/notificaciones/` |
| **Auditoría** | Trazabilidad | Registro de accesos, modificaciones sobre citas e informes, consulta de trazas | `modules/auditoria/` |
| **Administración** | Configuración de la plataforma | Gestión de profesionales, especialidades, horarios, cuentas de usuario y permisos | `modules/administracion/` |

## Reglas del monolito modular

| # | Regla | Motivo |
|---|---|---|
| 1 | Todos los módulos se despliegan juntos en el backend | Es un monolito: un solo proceso y un solo despliegue. |
| 2 | Un módulo usa a otro solo a través de su API pública | Evita que un cambio interno en un módulo rompa a los demás. Spring Modulith verifica esto. |
| 3 | Un módulo no lee ni escribe las tablas de otro módulo | Mantiene la independencia de datos de cada módulo. |
| 4 | Cada sistema externo se integra en un único módulo | La integración queda en un solo lugar y es fácil de reemplazar. |
| 5 | Cada módulo se organiza por dentro con Clean Architecture | Las reglas de negocio no dependen de la tecnología. |
## Diagrama de componentes arquitectónicos del monolito

<!-- imagen #12 — Mapa de Componentes Arquitectónicos y Límites de Módulos -->

```mermaid
flowchart TD

%% Entrada unificada
subgraph GATEWAY["CAPA DE ENTRADA HTTP"]
    API["<b>API REST Gateway</b><br>api/<br>Enrutamiento, autenticación JWT y validación DTO"]
end

%% Módulos Asistenciales Principales
subgraph ASISTENCIAL["MÓDULOS DEL NÚCLEO ASISTENCIAL"]
    ModCitas["<b>Módulo Citas Médicas</b><br>modules/citas/<br>Agendas, cupos y reservas"]
    ModLab["<b>Módulo Laboratorio</b><br>modules/laboratorio/<br>Análisis clínicos y reportes"]
    ModImg["<b>Módulo Diagnóstico por Imágenes</b><br>modules/imagenes/<br>Radiología y tomografías"]
end

%% Módulos de Soporte y Transversales
subgraph SOPORTE["MÓDULOS TRANSVERSALES Y DE GOBERNANZA"]
    ModId["<b>Módulo Identidad y Acceso</b><br>modules/identidad/<br>Usuarios, roles y RBAC"]
    ModNotif["<b>Módulo Notificaciones</b><br>modules/notificaciones/<br>Despacho de correos y alertas"]
    ModAudit["<b>Módulo Auditoría</b><br>modules/auditoria/<br>Trazas inmutables de operaciones"]
    ModAdmin["<b>Módulo Administración</b><br>modules/administracion/<br>Gestión de catálogos y personal"]
end

%% Servicios e Integraciones Externas
subgraph INTEGRACIONES["SISTEMAS EXTERNOS INTEGRADOS POR MÓDULO"]
    ExtReniec["RENIEC<br>Validación de identidad"]
    ExtSmtp["Servidor SMTP<br>Despacho de notificaciones"]
    ExtMinio["Almacenamiento MinIO/S3<br>Custodia de PDFs diagnósticos"]
end

%% Relaciones Gateway a Módulos
API -->|"Enruta peticiones de citas"| ModCitas
API -->|"Enruta peticiones de laboratorio"| ModLab
API -->|"Enruta peticiones de imágenes"| ModImg
API -->|"Enruta autenticación y perfil"| ModId
API -->|"Enruta administración"| ModAdmin

%% Relaciones Inter-Módulos vía Interfaces Públicas y Eventos en Memoria
ModCitas -.->|"Consulta filiación vía contrato IIdentidadService"| ModId
ModCitas -.->|"Publica CitaConfirmadaEvent (en memoria)"| ModNotif
ModCitas -.->|"Registra traza vía IAuditoriaService"| ModAudit

ModLab -.->|"Publica ResultadoPublicadoEvent"| ModNotif
ModLab -.->|"Registra traza"| ModAudit
ModImg -.->|"Publica ResultadoPublicadoEvent"| ModNotif

%% Integraciones dedicadas por módulo (Regla 4)
ModId -->|"Consulta DNI"| ExtReniec
ModNotif -->|"Envía correos"| ExtSmtp
ModLab -->|"Almacena PDF clínico"| ExtMinio
ModImg -->|"Almacena imágenes diagnósticas"| ExtMinio

%% Estilos sobrios y profesionales sin emojis
style GATEWAY fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#fff
style ASISTENCIAL fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#fff
style SOPORTE fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff
style INTEGRACIONES fill:#451a03,stroke:#fb923c,stroke-width:2px,color:#fff

style API fill:#1e293b,stroke:#38bdf8,color:#fff
style ModCitas fill:#065f46,stroke:#6ee7b7,stroke-width:2px,color:#fff
style ModLab fill:#065f46,stroke:#6ee7b7,color:#fff
style ModImg fill:#065f46,stroke:#6ee7b7,color:#fff

style ModId fill:#312e81,stroke:#a5b4fc,color:#fff
style ModNotif fill:#312e81,stroke:#a5b4fc,color:#fff
style ModAudit fill:#312e81,stroke:#a5b4fc,color:#fff
style ModAdmin fill:#312e81,stroke:#a5b4fc,color:#fff

style ExtReniec fill:#7c2d12,stroke:#f97316,color:#fff
style ExtSmtp fill:#7c2d12,stroke:#f97316,color:#fff
style ExtMinio fill:#7c2d12,stroke:#f97316,color:#fff
```

> **Alineamiento con los Drivers:** Este diseño garantiza el cumplimiento de **DA06 (Mantenibilidad y Evolución Modular)** permitiendo que cada módulo encapsule sus tablas y dependencias tecnológicas, comunicándose exclusivamente a través de contratos e interfaces públicas.

