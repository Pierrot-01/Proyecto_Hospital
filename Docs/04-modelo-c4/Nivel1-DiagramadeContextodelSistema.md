# Nivel 1 · Diagrama de contexto del sistema

> **Proyecto:** Sistema de Gestión Hospitalaria (HRA) – Hospital Regional Docente de Las Mercedes  
> **Modelo:** C4 · Nivel 1 de 4 · **Versión:** 1.0

---

## 1. Objetivo

Mostrar el **Sistema Hospitalario HRA como una sola caja**: quiénes interactúan con él (pacientes, personal médico, asistencial y administrativo) y con qué sistemas externos del ecosistema de salud estatal se comunica. Es la vista de mayor nivel y la primera que se presenta a directivos, auditores de salud y equipo técnico.

| Aspecto | Descripción |
|---|---|
| **Pregunta que responde** | ¿Qué es el sistema hospitalario HRA, quién lo usa y con qué servicios externos se integra? |
| **Audiencia** | Directores médicos, jefatura de estadística e informática, auditores de salud, equipo de desarrollo y operaciones |
| **Qué NO muestra** | Tecnologías de implementación, frameworks, servidores, bases de datos ni módulos internos |
| **Siguiente nivel** | `Nivel2-DiagramadeContenedores.md` |

---

## 2. Diagrama

<!-- imagen #07 — C4 Nivel 1: Diagrama de Contexto del Sistema HRA -->

```mermaid
flowchart TD

%% Personas
subgraph PERSONAS["👥 PERSONAS — Usuarios del Sistema"]
    Paciente["<b>Paciente</b><br>Persona<br>Reserva citas, consulta historial<br>y descarga resultados."]
    Admision["<b>Personal de Admisión</b><br>Persona<br>Registra pacientes y gestiona<br>turnos presenciales."]
    Medico["<b>Médico / Profesional</b><br>Persona<br>Registra atenciones y firma<br>informes diagnósticos."]
    AdminTI["<b>Administrador de TI</b><br>Persona<br>Administra cuentas, roles<br>y pistas de auditoría."]
end

%% Sistema en alcance
subgraph ALCANCE["🏥 SISTEMA EN ALCANCE"]
    HRA["<b>Sistema HRA</b><br>Sistema de Software<br>Plataforma integral de gestión de citas,<br>atenciones y resultados diagnósticos."]
end

%% Sistemas externos
subgraph EXTERNOS["🌐 SISTEMAS EXTERNOS"]
    RENIEC["<b>Servicio RENIEC</b><br>Sistema Externo<br>Valida identidad del ciudadano<br>mediante DNI."]
    Notificador["<b>Servicio de Notificaciones</b><br>Sistema Externo<br>Envía correos electrónicos<br>y mensajes de confirmación."]
    Firma["<b>Servicio Firma Digital</b><br>Sistema Externo<br>Certifica e impone sellos de<br>tiempo a informes médicos."]
end

%% Relaciones
Paciente -->|"Consulta disponibilidad, reserva<br>citas y descarga resultados"| HRA
Admision -->|"Registra filiación y gestiona<br>turnos presenciales"| HRA
Medico -->|"Registra atenciones<br>y emite diagnósticos"| HRA
AdminTI -->|"Configura roles, horarios<br>y monitorea auditoría"| HRA

HRA -->|"Consulta y valida DNI<br>via HTTPS REST"| RENIEC
HRA -->|"Despacha recordatorios<br>y avisos clínicos via SMTP"| Notificador
HRA -->|"Solicita sellado y firma<br>electrónica via HTTPS"| Firma

%% Estilos — azul para personas, verde para sistema, naranja para externos
style PERSONAS fill:#0c4a6e,stroke:#38bdf8,stroke-width:2px,color:#fff
style ALCANCE fill:#0f172a,stroke:#22c55e,stroke-width:3px,color:#fff
style EXTERNOS fill:#7c2d12,stroke:#f97316,stroke-width:2px,color:#fff

style Paciente fill:#075985,stroke:#38bdf8,color:#fff
style Admision fill:#075985,stroke:#38bdf8,color:#fff
style Medico fill:#075985,stroke:#38bdf8,color:#fff
style AdminTI fill:#075985,stroke:#38bdf8,color:#fff

style HRA fill:#14532d,stroke:#22c55e,stroke-width:3px,color:#fff

style RENIEC fill:#9a3412,stroke:#f97316,color:#fff
style Notificador fill:#9a3412,stroke:#f97316,color:#fff
style Firma fill:#9a3412,stroke:#f97316,color:#fff
```

![Diagrama de contexto del Sistema HRA](../../Img/img04.png)

> **Archivo editable:** `img/fuentes/nivel1-contexto.drawio`

---

## 3. Personas (usuarios)

| Persona | Descripción | Qué hace en el sistema |
|---|---|---|
| **Paciente** | Usuario asistencial que requiere atención médica | Consulta disponibilidad de turnos por especialidad, reserva citas ambulatorias, reprograma o cancela, y visualiza/descarga informes de laboratorio e imágenes. |
| **Personal de Admisión** | Personal administrativo de ventanilla y admisión hospitalaria | Valida la identidad y filiación del paciente, gestiona citas asignadas por ventanilla, emite fichas de atención y bloquea agendas por contingencias. |
| **Médico / Profesional** | Especialista asistencial en consultorios o servicios de diagnóstico | Consulta la lista de pacientes citados en el día, registra la evolución de la atención clínica, prescribe exámenes diagnósticos y emite diagnósticos con firma. |
| **Administrador de TI** | Encargado del soporte técnico y gobernanza del sistema | Gestiona el catálogo de consultorios y especialidades, asigna roles y permisos según el principio de menor privilegio, y supervisa las pistas de auditoría. |

---

## 4. Sistemas

| Sistema | Tipo | Responsabilidad | Quién lo construye / opera |
|---|---|---|---|
| **Sistema HRA** | Sistema en alcance | Automatiza el flujo asistencial de citas, atenciones y consulta de resultados para el Hospital Regional Docente Las Mercedes. | Equipo del proyecto |
| **Servicio RENIEC** | Sistema externo | Valida en línea la autenticidad del Documento Nacional de Identidad y extrae nombres y apellidos oficiales. | Registro Nacional de Identificación y Estado Civil |
| **Servicio Notificaciones** | Sistema externo | Envía avisos de citas por correo electrónico (SMTP institucional) o mensajería electrónica. | Proveedor de infraestructura de comunicaciones |
| **Servicio Firma Digital** | Sistema externo | Genera sellos criptográficos conformes a la normativa de firma digital para validez legal de informes médicos. | Plataforma de acreditación PKI / MINSA |

---

## 5. Relaciones

| Origen | Destino | Descripción | Protocolo |
|---|---|---|---|
| Paciente | Sistema HRA | Solicita citas, reprograma y consulta resultados diagnósticos | — (Interfaz Web) |
| Personal de Admisión | Sistema HRA | Registra pacientes presenciales y programa turnos en ventanilla | — (Interfaz Web) |
| Médico / Profesional | Sistema HRA | Registra evolución clínica y aprueba diagnósticos | — (Interfaz Web) |
| Administrador de TI | Sistema HRA | Administra catálogos hospitalarios, credenciales y monitorea logs | — (Interfaz Web) |
| Sistema HRA | RENIEC | Valida datos de identidad mediante consulta de DNI | HTTPS / REST |
| Sistema HRA | Servicio Notificaciones | Despacha alertas de citas confirmadas y resultados disponibles | HTTPS / REST / SMTP |
| Sistema HRA | Servicio Firma Digital | Solicita estampillado digital y firma de resultados médicos | HTTPS / REST |

> *Nota:* En el Nivel 1 no se detallan tecnologías internas de los canales de usuario; estas se desglosan en el Nivel 2.

---

## 6. Decisiones y supuestos

| # | Decisión o supuesto | Motivo |
|---|---|---|
| 1 | Las integraciones con servicios externos se realizan exclusivamente vía HTTPS/REST | Permite desacoplamiento total, protegiendo las bases de datos hospitalarias y cumpliendo estándares de interoperabilidad. |
| 2 | En caso de indisponibilidad temporal de RENIEC, el sistema permite registro asistido con validación manual diferida | Evita la interrupción de la atención de emergencia o admisión prioritaria ante caídas del servicio nacional. |
| 3 | El sistema no manipula datos de tarjetas de crédito o pasarelas financieras en esta fase inicial | Las atenciones se gestionan bajo el régimen de salud pública (SIS / copago en caja hospitalaria física). |
| 4 | Los sistemas externos no se modifican | Son servicios centralizados del estado o de proveedores consolidados; el Sistema HRA implementa adaptadores de integración. |

### Pendientes por definir

| Tema | Detalle |
|---|---|
| Integración con el Sistema de Información Hospitalaria nacional (SIS / FUA) | Evaluar la sincronización con el Formato Único de Atención digital del Seguro Integral de Salud en la fase 2. |
| Proveedor de mensajería móvil instantánea (WhatsApp API) | Evaluar costos y viabilidad para el envío de recordatorios automáticos 24 horas antes de la cita para reducir el ausentismo hospitalario. |
