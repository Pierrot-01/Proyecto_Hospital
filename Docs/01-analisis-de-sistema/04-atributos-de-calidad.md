# Atributos de calidad

| ID | Atributo de calidad | Escenario de calidad |
|---|---|---|
| AC01 | **Rendimiento** | Las consultas esenciales (disponibilidad, citas, resultados) deben responder dentro de los tiempos definidos incluso con alta concurrencia de usuarios. |
| AC02 | **Escalabilidad** | El sistema debe soportar un incremento progresivo de usuarios concurrentes sin degradación significativa del servicio. |
| AC03 | **Disponibilidad** | El sistema debe permanecer disponible durante el horario definido para que pacientes y personal realicen sus operaciones. |
| AC04 | **Seguridad** | Los datos de pacientes, resultados diagnósticos y operaciones sensibles deben estar protegidos frente a accesos no autorizados. |
| AC05 | **Integridad** | El sistema debe garantizar una sola reserva confirmada por cupo ante solicitudes concurrentes y mantener la consistencia de los datos. |
| AC06 | **Confiabilidad** | Los fallos en servicios secundarios (correo, SMS) no deben invalidar las operaciones principales ya confirmadas. |
| AC07 | **Mantenibilidad** | El sistema debe estar organizado en módulos con dependencias controladas que permitan realizar cambios sin afectar funcionalidades no relacionadas. |
| AC08 | **Accesibilidad** | La interfaz debe ser responsive y cumplir criterios WCAG 2.2 AA para ser usable desde dispositivos móviles y por personas con discapacidades. |
| AC09 | **Recuperación** | El sistema debe contar con respaldos y procedimientos comprobables de restauración con RPO y RTO definidos. |
