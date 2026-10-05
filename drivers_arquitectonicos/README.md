# Drivers Arquitectónicos

Los **Drivers Arquitectónicos** (o impulsores de la arquitectura) son los requerimientos que tienen un impacto profundo en la estructura del software.

## Principales Atributos de Calidad

1. **Integridad Transaccional (La Doble Reserva)**
   - **Problema:** Evitar cruces de horarios.
   - **Estrategia:** Uso de memoria caché rápida (Redis `SETNX`) junto con una barrera final en la base de datos (PostgreSQL EXCLUDE Constraints y GiST) para evitar la concurrencia destructiva.

2. **Disponibilidad y Recuperación (RPO)**
   - **Problema:** La pérdida de información clínica es inaceptable. Un RPO de 24 hrs es insuficiente.
   - **Estrategia:** Implementación de **WAL Archiving** en PostgreSQL para permitir Point-In-Time Recovery (PITR), reduciendo la pérdida de datos a minutos ante desastres.

3. **Seguridad Clínica y Legal (Privacidad)**
   - **Problema:** Datos sensibles (diagnósticos, identidades) expuestos a fugas.
   - **Estrategia:** Implementación de un **KMS (Key Management Service)** para el Cifrado en Reposo (*Encryption at Rest*) tanto en base de datos (PostgreSQL) como en el sistema de archivos (MinIO).

4. **Rendimiento**
   - **Problema:** Alta carga en lecturas (ej. listas de médicos) frente a escrituras complejas.
   - **Estrategia:** Implementación del patrón **CQRS** para optimizar las consultas de solo lectura en milisegundos.

5. **Interoperabilidad**
   - **Problema:** Integración futura con el MINSA o SIS.
   - **Estrategia:** Uso del estándar **HL7 FHIR** a nivel de DTOs y Presenters para un mapeo directo.
