# Estilo y Enfoque Arquitectónico

Este directorio detalla la arquitectura de software seleccionada para balancear la complejidad, el rendimiento y la mantenibilidad del sistema hospitalario.

## 1. Arquitectura Macro: Monolito Modular Orientado a Eventos
En lugar de un monolito clásico desordenado o una red compleja de microservicios, se ha optado por el "punto dulce" para este caso:
- **Modularidad (DDD):** El código se divide lógicamente por Contextos Delimitados (Identidad, Citas, Diagnósticos).
- **Despliegue Stateless:** El backend vive en contenedores Docker y no guarda estado, lo que facilita el escalamiento horizontal detrás de un balanceador de carga.
- **Asincronía (Event-Driven):** Procesos bloqueantes o masivos se delegan a colas de mensajería (RabbitMQ) para ser procesados por *Workers* en segundo plano.

## 2. Arquitectura Micro: Clean Architecture + CQRS
- **Aislamiento del Dominio:** La lógica de negocio (Reglas Clínicas) está completamente separada de los detalles técnicos (Base de Datos, Frameworks Web, Mensajería).
- **CQRS (Command Query Responsibility Segregation):** 
  - **Commands (Escritura):** Usan Clean Architecture completa para asegurar que todas las reglas de negocio y validaciones se cumplan al agendar o modificar datos.
  - **Queries (Lectura):** Realizan *bypass* directo hacia la base de datos o modelos de vista para entregar información ultrarrápida.

## 3. Stack Tecnológico General
- **Frontend:** Angular 18
- **Backend:** Node.js 20 LTS (Express / Fastify)
- **Base de Datos:** PostgreSQL
- **Caché:** Redis
- **Storage:** MinIO (S3 Compatible)
- **Mensajería:** RabbitMQ
- **Infraestructura:** Docker y Docker Compose
- **Monitoreo:** Prometheus + Grafana
