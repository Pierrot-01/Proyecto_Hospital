# Guía Maestra para la Sustentación de Arquitectura de Software

> **Proyecto:** Sistema Web para la Gestión de Citas Médicas y la Entrega Digital de Resultados Diagnósticos  
> **Institución:** Hospital Regional Docente de Las Mercedes (HRA)  
> **Universidad:** Universidad Nacional de San Cristóbal de Huamanga (UNSCH)  
> **Escuela:** Ingeniería de Sistemas · **Curso:** IS-488 Arquitectura de Software  
> **Docente:** Ing. Lizbeth Jaico Quispe · **Alumno:** Jhony Alberto Sulca Mendoza (27202119)  
> **Repositorio Oficial:** [GitHub - Pierrot-01/Proyecto_Hospital](https://github.com/Pierrot-01/Proyecto_Hospital)

---

## ⏱️ Estructura y Tiempos de la Exposición (15 a 20 Minutos)

```
[00:00 - 02:30]  1. Introducción, Problemática del Hospital y Alcance
[02:30 - 05:00]  2. Drivers Arquitectónicos y Atributos de Calidad Críticos
[05:00 - 08:30]  3. Selección del Estilo y Enfoque (Monolito Modular + Clean Architecture)
[08:30 - 13:00]  4. Modelo C4 Completo (Niveles 1, 2, 3 y 4)
[13:00 - 16:00]  5. Patrones de Diseño, Principios SOLID y Control de Concurrencia
[16:00 - 18:00]  6. Boilerplate de Referencia y Conclusiones
[18:00 - 20:00]  7. Ronda de Preguntas y Defensa Técnica
```

---

## 🎤 Guion de Exposición: Paso a Paso (Qué Decir y Dónde Apuntar)

### BLOQUE 1: Introducción y Problemática (00:00 - 02:30)

#### 🗣️ Qué decir:
> *"Buenos días, ingeniera Lizbeth y compañeros. El día de hoy sustentaré la arquitectura de software del **Sistema de Gestión de Citas Médicas y Entrega Digital de Resultados Diagnósticos** para el Hospital Regional Docente de Las Mercedes (HRA).*
>
> *En los hospitales regionales del país, los pacientes suelen realizar dobles desplazamientos físicos: primero para formar colas de madrugada por un turno, y días después para recoger físicamente un informe de laboratorio o placa radiográfica. Esto no solo genera saturación en ventanillas, sino pérdidas económicas para pacientes de zonas rurales.*
>
> *Nuestra solución arquitectónica busca resolver este problema mediante una plataforma web que garantice dos flujos asistenciales críticos: **reserva concurrente de citas sin duplicidad de turnos** y **entrega digital segura de análisis clínicos validados con sellado digital**."*

#### 📂 Documento de respaldo:
- [`Docs/01-analisis-de-sistema/01-actores.md`](Docs/01-analisis-de-sistema/01-actores.md) y [`02-historias-de-usuario.md`](Docs/01-analisis-de-sistema/02-historias-de-usuario.md).

---

### BLOQUE 2: Drivers Arquitectónicos y Calidad (02:30 - 05:00)

#### 🗣️ Qué decir:
> *"Una arquitectura no se elige por moda tecnológica, sino guiada por sus **Drivers Arquitectónicos**. Para el sistema HRA hemos priorizado 4 drivers intransigibles:*
> 1. ***DA01 Concurrencia y Rendimiento:*** *Soportar aperturas masivas de cupos con latencia p95 ≤ 3 segundos y evaluar picos de hasta 1 000 usuarios concurrentes.*
> 2. ***DA02 Integridad Transaccional de Citas:*** *Garantizar que ante solicitudes simultáneas sobre el mismo médico y fecha, solo un paciente obtenga la confirmación (cero doble asignación).*
> 3. ***DA03 Protección y Confidencialidad:*** *Informes médicos protegidos por roles RBAC, accesibles mediante URLs prefirmadas de corta duración y con pistas de auditoría inmutables.*
> 4. ***DA06 Mantenibilidad y Evolución Modular:*** *Límites claros entre módulos de negocio para permitir desarrollo paralelo y pruebas unitarias aisladas sin levantar bases de datos."*

#### 📂 Documento de respaldo:
- [`Docs/01-analisis-de-sistema/06-drivers-arquitectonicos.md`](Docs/01-analisis-de-sistema/06-drivers-arquitectonicos.md)
- [`Docs/01-analisis-de-sistema/04-atributos-de-calidad.md`](Docs/01-analisis-de-sistema/04-atributos-de-calidad.md)

---

### BLOQUE 3: Estilo y Enfoque Arquitectónico (05:00 - 08:30)

#### 🗣️ Qué decir:
> *"Para cumplir con estos drivers, evaluamos dos decisiones fundamentales:*
>
> ***1. Estilo Arquitectónico: Monolito Modular con Workers Asíncronos*** *(Imagen: `img_estilo_monolito.svg`).*
> *Descartamos Microservicios porque para un equipo académico y una escala hospitalaria regional de 1 000 concurrentes, la sobrecarga operativa de redes distribuidas, fallas parciales y consistencia eventual introducía riesgos innecesarios. Un **Monolito Modular** nos permite transacciones ACID locales y despliegue unificado, pero manteniendo límites estrictos de paquetes y esquemas de base de datos aislados.*
> *Complementamos con **Workers Asíncronos** para que tareas lentas (generación de PDFs pesados y despachos SMTP) no degraden la latencia de reserva de citas.*
>
> ***2. Enfoque Interno: Clean Architecture*** *(Imagen: `img02.png`).*
> *Dentro de cada módulo aplicamos la **Regla de Dependencia de Robert C. Martin**. Organizamos el código en 4 capas concéntricas:*
> - ***Dominio:*** *Entidades médicas (`Cita`, `Paciente`), reglas invariantes y Puertos (interfaces).*
> - ***Aplicación:*** *Casos de uso (`ReservarCitaUseCase`) que orquestan el negocio sin conocer librerías externas.*
> - ***Presentación:*** *Controladores REST que transforman HTTP a comandos.*
> - ***Infraestructura:*** *Adaptadores de PostgreSQL, Redis, MinIO S3 y RENIEC.*
> *Gracias a la **Inversión de Dependencias (DIP)**, el núcleo clínico no depende de Spring, Angular ni PostgreSQL; son los adaptadores externos quienes implementan los puertos del dominio."*

#### 📂 Documento de respaldo:
- [`Docs/02-arquitectura-software/estilo-arquitectonico.md`](Docs/02-arquitectura-software/estilo-arquitectonico.md)
- [`Docs/02-arquitectura-software/enfoque-arquitectonico.md`](Docs/02-arquitectura-software/enfoque-arquitectonico.md)

---

### BLOQUE 4: El Modelo C4 (08:30 - 13:00)

#### 🗣️ Qué decir:
> *"Para comunicar la arquitectura de manera inequívoca, utilizamos el **Modelo C4 de Simon Brown**, desglosado en sus 4 niveles de abstracción:*
>
> - ***Nivel 1: Diagrama de Contexto*** *(Imagen `img04.png`): Vemos al Sistema HRA como una sola caja. Muestra quiénes son los usuarios (Pacientes, Personal de Admisión, Médicos y TI) y con qué sistemas estatales se integra: RENIEC (para validar identidad), Notificaciones (alertas) y Firma Digital (validez legal de informes médicos).*
>
> - ***Nivel 2: Diagrama de Contenedores*** *(Imagen `img05.png`): Abrimos la caja del hospital en 6 contenedores ejecutables:*
>   *1. Aplicación Web SPA (Frontend reactivo).*
>   *2. API Backend HRA (Monolito Modular).*
>   *3. Workers en Segundo Plano (Procesos fuera de banda).*
>   *4. Base de Datos PostgreSQL 16 (Garantía ACID).*
>   *5. Caché Redis 7 (Semáforos distribuidos y catálogos en memoria).*
>   *6. MinIO / S3 Storage (Archivos clínicos y PDFs).*
>
> - ***Nivel 3: Diagrama de Componentes*** *(Imagen `img06.png`): Abrimos el backend y mostramos sus módulos delimitados: `Usuarios`, `Pacientes`, `Citas`, `Atenciones`, `Diagnósticos`, `Notificaciones` y `Auditoría`. Cada uno con esquema de base de datos propio y comunicándose internamente vía API pública o eventos desacoplados.*
>
> - ***Nivel 4: Diagrama de Código*** *(Imágenes `img07.png` y `img08.png`): Mostramos el diseño UML a nivel de clases y secuencia para el flujo crítico de **Reservar Cita**."*

#### 📂 Documento de respaldo:
- [`Docs/04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md`](Docs/04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md)
- [`Docs/04-modelo-c4/Nivel2-DiagramadeContenedores.md`](Docs/04-modelo-c4/Nivel2-DiagramadeContenedores.md)
- [`Docs/04-modelo-c4/Nivel3-Diagrama-de-Componentes.md`](Docs/04-modelo-c4/Nivel3-Diagrama-de-Componentes.md)
- [`Docs/04-modelo-c4/Nivel4-DiagramadeCodigo.md`](Docs/04-modelo-c4/Nivel4-DiagramadeCodigo.md)

---

### BLOQUE 5: Patrones de Diseño, SOLID y Concurrencia (13:00 - 16:00)

#### 🗣️ Qué decir:
> *"La calidad arquitectónica se sostiene en buenas prácticas de diseño:*
>
> ***1. Patrones de Diseño Aplicados*** *(Imagen `img09.png`):*
> - ***Adapter:*** *Aísla APIs de terceros (`ReniecRestAdapter`, `SmtpNotificadorAdapter`) detrás de contratos.*
> - ***Repository:*** *Encapsula consultas SQL en `PostgresCitaRepository` protegiendo al caso de uso.*
> - ***Decorator:*** *Agrega caché y semáforos Redis sobre la consulta de turnos sin alterar el repositorio de datos.*
>
> ***2. Principios SOLID*** *(Imagen `img10.png`):*
> - ***S (Responsabilidad Única):*** *El controlador solo maneja HTTP; el caso de uso solo orquesta; la entidad valida reglas médicas.*
> - ***O (Abierto/Cerrado):*** *Para añadir notificaciones por WhatsApp, solo creamos un nuevo adaptador sin modificar el caso de uso existente.*
> - ***D (Inversión de Dependencias):*** *Los casos de uso dependen de interfaces (`NotificadorPort`), no de clases concretas (`SmtpService`).*
>
> ***3. Solución a la Concurrencia (Flujo de Secuencia):***
> *Cuando un paciente solicita una cita, el caso de uso ejecuta un candado atómico en Redis (`SET NX EX`) con clave `cupo:medico_id:fecha`. Si dos pacientes hacen clic al mismo milisegundo, solo uno adquiere el candado; el segundo recibe de inmediato un código HTTP `409 Conflict`, protegiendo la base de datos de bloqueos pesados."*

#### 📂 Documento de respaldo:
- [`Docs/03-diseño-de-software/diseño-interno/patrones-de-diseño.md`](Docs/03-diseño-de-software/diseño-interno/patrones-de-diseño.md)
- [`Docs/03-diseño-de-software/diseño-interno/principios-de-diseño.md`](Docs/03-diseño-de-software/diseño-interno/principios-de-diseño.md)

---

### BLOQUE 6: Boilerplate de Referencia y Conclusiones (16:00 - 18:00)

#### 🗣️ Qué decir:
> *"Para validar la viabilidad técnica de la propuesta, implementamos en la carpeta `tecnologia/boilerplate-clean-arquitecture` un prototipo funcional en Angular 18 con TypeScript que evidencia:*
> 1. *Carpetas estrictamente organizadas por capas: `dominio/`, `aplicacion/`, `infraestructura/` y `presentacion/`.*
> 2. *Inyección de dependencias configurada en `app.config.ts`.*
> 3. *Pruebas unitarias en `dominio.pruebas.ts` que validan las reglas del negocio en memoria sin servidor ni base de datos activa.*
>
> ***Conclusiones:***
> *La arquitectura propuesta equilibra simplicidad operativa, alta integridad transaccional, modularidad estricta y preparación para el futuro. Cumple con los 9 atributos de calidad y ofrece al Hospital Las Mercedes una base sólida para su transformación digital."*

#### 📂 Documento de respaldo:
- [`tecnologia/boilerplate-clean-arquitecture/README.md`](tecnologia/boilerplate-clean-arquitecture/README.md)
- [`README.md`](README.md)

---

## 🛡️ Guía de Defensa: Preguntas Difíciles del Jurado / Docente

### Pregunta 1: *"¿Por qué no usaste Microservicios si hoy en día es el estándar de la industria?"*
> **Respuesta contundente:**
> *"Ingeniera, los microservicios resuelven un problema de **escala organizacional y despliegue independiente en equipos de decenas de desarrolladores**. En nuestro caso, el sistema HRA tiene un equipo acotado y una demanda proyectada de 1 000 usuarios concurrentes.*
> *Implementar microservicios hubiera introducido: latencia de red en cada llamada, complejidad de transacciones distribuidas (Sagas/2PC) y monitoreo distribuido complejo, poniendo en riesgo la integridad de las historias clínicas.*
> *El **Monolito Modular** nos da los mismos beneficios de orden y límites limpios, con transacciones ACID directas y despliegue unificado. Si en el futuro el módulo de Diagnósticos requiere escalar de forma independiente, sus límites ya están aislados para extraerlo sin refactorizar la base de datos."*

---

### Pregunta 2: *"¿Dónde se rompe o se protege la Regla de Dependencia en tu código?"*
> **Respuesta contundente:**
> *"La Regla de Dependencia exige que las dependencias solo apunten hacia el Dominio. Se protege mediante el **Principio de Inversión de Dependencias (DIP)**.*
> *Por ejemplo: el caso de uso `ReservarCitaUseCase` (capa de Aplicación) necesita guardar datos en PostgreSQL. Si importara directamente `TypeORM` o `pg`, se rompería la regla. En su lugar, el Dominio define la interfaz `CitaRepository`. El caso de uso solo conoce esa interfaz.*
> *La clase concreta `PostgresCitaRepository` vive en la capa de Infraestructura e implementa la interfaz. Por lo tanto, el flujo de control va hacia la BD, pero la dependencia de código apunta hacia adentro, hacia el Dominio."*

---

### Pregunta 3: *"¿Por qué usas MinIO / S3 en lugar de guardar los PDFs como BLOB en PostgreSQL?"*
> **Respuesta contundente:**
> *"Guardar archivos binarios pesados (como informes de tomografías o radiografías) en campos `BYTEA` o `BLOB` de PostgreSQL degrada severamente el rendimiento del buffer pool de memoria, satura el canal de replicación y hace que los backups diarios sean gigabytes más pesados.*
> *Al usar **MinIO (almacenamiento de objetos compatible con S3)**, PostgreSQL solo guarda la URL o clave del objeto (pocos bytes). Las descargas se realizan mediante **URLs prefirmadas temporales de 15 minutos**, descargando tráfico de la base de datos y garantizando seguridad."*

---

### Pregunta 4: *"¿Cómo aseguras que dos pacientes no reserven el mismo cupo médico al mismo tiempo?"*
> **Respuesta contundente:**
> *"Aplicamos una estrategia de **defensa en dos capas**:**
> 1. ***Capa Rápida (Redis In-Memory):*** *Antes de consultar la BD, se intenta adquirir un candado distribuido atómico mediante `SET cupo:profesional:fecha NX EX 5` (caduca en 5 segundos). Si el candado ya existe, la petición se rechaza de inmediato con HTTP 409 sin tocar PostgreSQL.*
> 2. ***Capa Definitiva (PostgreSQL):*** *La tabla `citas` cuenta con una restricción de unicidad compuesta `UNIQUE(profesional_id, fecha_hora)` y la transacción se ejecuta con nivel de aislamiento estricto. Esto garantiza matemáticamente cero duplicidad."*

---

### Pregunta 5: *"¿Qué diferencia hay entre tu Nivel 3 (Componentes) y Nivel 4 (Código) en C4?"*
> **Respuesta contundente:**
> *"El **Nivel 3** muestra las piezas modulares del backend hospitalario (`Citas`, `Pacientes`, `Atenciones`, etc.), sus responsabilidades y cómo se comunican entre sí mediante eventos y contratos.*
> *El **Nivel 4** hace un zoom dentro del módulo más crítico (`Citas Médicas`) y muestra la estructura UML concreta de clases: las interfaces de los puertos, la entidad agregada con sus invariantes, y el diagrama de secuencia paso a paso de las llamadas en memoria durante una reserva."*

---

## 📊 Matriz Rápida de Ubicación de Recursos

| Si te piden mostrar... | Abre este archivo | Elemento visual destacado |
|---|---|---|
| Arquitectura General | `Docs/02-arquitectura-software/arquitectura-inicial.md` | `Img/img01.png` + Mermaid general |
| Monolito Modular con Workers | `Docs/02-arquitectura-software/estilo-arquitectonico.md` | `Img/img_estilo_monolito.svg` |
| Clean Architecture en Capas | `Docs/02-arquitectura-software/enfoque-arquitectonico.md` | `Img/img02.png` + Mermaid 4 capas y DIP |
| Componentes Arquitectónicos | `Docs/02-arquitectura-software/componentes-arquitectonicos.md` | `Img/img06.png` |
| C4 Nivel 1 (Contexto) | `Docs/04-modelo-c4/Nivel1-DiagramadeContextodelSistema.md` | `Img/img04.png` + Tabla de actores |
| C4 Nivel 2 (Contenedores) | `Docs/04-modelo-c4/Nivel2-DiagramadeContenedores.md` | `Img/img05.png` + Seguridad entre contenedores |
| C4 Nivel 3 (Componentes) | `Docs/04-modelo-c4/Nivel3-Diagrama-de-Componentes.md` | `Img/img06.png` + Reglas del monolito modular |
| C4 Nivel 4 (Clases y Secuencia) | `Docs/04-modelo-c4/Nivel4-DiagramadeCodigo.md` | `Img/img07.png` (Clases) y `Img/img08.png` (Secuencia) |
| Patrones de Diseño | `Docs/03-diseño-de-software/diseño-interno/patrones-de-diseño.md` | `Img/img09.png` (Adapter, Repository, Decorator) |
| Principios SOLID | `Docs/03-diseño-de-software/diseño-interno/principios-de-diseño.md` | `Img/img10.png` (Tabla qué pasaría sin SOLID) |
| Código de Referencia Angular | `tecnologia/boilerplate-clean-arquitecture/src/` | Estructura de carpetas Clean Architecture |

---

> 💡 **Consejo de Oro para la Exposición:**  
> Habla con calma, mira a la docente con seguridad y siempre fundamenta cada decisión conectándola con un **atributo de calidad** o un **driver de negocio del hospital**. Demostrarás dominio técnico absoluto y criterio de arquitecto de software senior.
