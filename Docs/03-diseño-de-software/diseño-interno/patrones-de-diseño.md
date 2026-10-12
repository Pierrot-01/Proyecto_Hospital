# Patrones de diseño

## Objetivo

Documentar los patrones de diseño aplicados en el backend del sistema HRA, indicando dónde se usan, qué problema resuelven y con qué tecnología se implementan, para que el equipo programe de forma uniforme.

## Contexto

- **Estilo:** monolito modular (Java + Spring Boot + Spring Modulith o TypeScript + Express).
- **Enfoque interno:** Clean Architecture.
- **Base:** diagrama de componentes (C4 nivel 3).

## Patrones aplicados

![Patrones de Diseño Aplicados](../../../Img/img09.png)

| Patrón | Dónde se usa | Problema que resuelve | Se implementa con | Clases en el código |
|---|---|---|---|---|
| Repository | Todos los módulos → Base de datos | El negocio no debe conocer SQL ni JPA | Spring Data JPA / PostgreSQL | `CitaRepository` (interfaz dominio), `JpaCitaRepository` (infraestructura) |
| Adapter | Notificaciones → Servicio de correo | El servicio de correo tiene su propia API | JavaMailSender o API REST del proveedor | `NotificadorPort` (dominio), `EmailNotificadorAdapter` (infraestructura) |
| Adapter | Laboratorio/Imágenes → Almacenamiento S3 | El proveedor de almacenamiento tiene su propia API | SDK S3 compatible | `AlmacenamientoPort` (dominio), `S3AlmacenamientoAdapter` (infraestructura) |
| Decorator | Citas → Caché | Consultar disponibilidad más rápido sin modificar el repositorio | Redis (si se justifica con perfilamiento) | `CachedDisponibilidadRepository` envuelve `JpaDisponibilidadRepository` |
| Observer | Citas → Notificaciones | Notificar al paciente sin acoplar el módulo de citas al de notificaciones | Eventos Spring Modulith / EventBus | `CitaConfirmadaEvent` publicado por Citas, consumido por Notificaciones |

## Cómo funciona cada patrón

| Patrón | En pocas palabras |
|---|---|
| Repository | El negocio dice `guardar(cita)`; el repositorio escribe con JPA/SQL. |
| Adapter | El sistema dice `enviarConfirmacion(cita)` y el adaptador lo convierte en la llamada propia del servicio de correo o de S3. |
| Decorator | Busca primero en Redis; si no está, consulta PostgreSQL y lo guarda en Redis para la próxima vez. |
| Observer | Cuando se confirma una cita, se publica un evento. El módulo de Notificaciones lo escucha y envía el correo. Si falla, el evento se persiste para reintento. |

## Beneficio

- Cambiar el proveedor de correo, el almacenamiento S3 o la base de datos solo afecta al adaptador o al repositorio.
- La caché con Redis se puede activar o retirar sin tocar las reglas de negocio.
- Las notificaciones se pueden procesar en un worker separado sin modificar el flujo de reserva de citas.

## Patrones previstos para siguientes iteraciones

| Patrón | Dónde se aplicaría | Cuándo |
|---|---|---|
| Factory | Creación de diferentes tipos de estudio diagnóstico | Si los tipos de estudio se diversifican más allá de laboratorio, radiografía, ecografía y tomografía. |
| Strategy | Validación de resultados según tipo de estudio | Si las reglas de validación difieren significativamente entre laboratorio e imágenes. |
| Facade | Comunicación entre módulos | Cuando los módulos crezcan y necesiten una única puerta de entrada simplificada. |
