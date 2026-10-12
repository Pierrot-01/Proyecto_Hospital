# Sistema de Gestión Hospitalaria (HRA) — Arquitectura Limpia con Angular

Curso: **IS-488 Arquitectura de Software** · UNSCH · Semestre 2026-II  
Docente: Ing. Lizbeth Jaico Quispe  
Caso de estudio: **Hospital Regional Docente de Las Mercedes (HRA)**  

Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) v18.  
Todo el código —clases, variables, métodos y comentarios— está en español y modelado según el dominio hospitalario.

---

## Puesta en marcha

```bash
npm install
npm start          # Aplicación en http://localhost:4200
npm run pruebas    # Pruebas del dominio puro, sin Angular ni navegador
npm run build      # Compilación de producción
```

> **Nota:** No necesita base de datos externa ni conexión a internet para la demostración: el proyecto inicia con adaptadores en memoria listos para interactuar.

---

## Las cuatro capas de Clean Architecture

```text
src/app/
│
├── dominio/                    ← EL CENTRO. Reglas puras del hospital. No conoce Angular.
│   ├── modelos/
│   │   ├── paciente.modelo.ts      Entidad Paciente, validación de DNI y filiación
│   │   ├── horario-cupo.modelo.ts  Objeto de valor de turno médico y control de concurrencia
│   │   ├── cita.modelo.ts          Entidad Cita, estados y regla de cancelación anticipada
│   │   └── tarifas-hospital.ts     Cálculo de copago asistencial (SIS, Particular, EsSalud)
│   └── contratos/              ← Las interfaces (puertos) viven AQUÍ
│       ├── repositorio-citas.contrato.ts
│       ├── repositorio-horarios.contrato.ts
│       ├── notificador-paciente.contrato.ts
│       └── validador-identidad.contrato.ts
│
├── aplicacion/                 ← CASOS DE USO. Solo importan Dominio.
│   ├── consultar-disponibilidad.caso-uso.ts
│   ├── reservar-cita.caso-uso.ts
│   └── cancelar-cita.caso-uso.ts
│
├── infraestructura/            ← ADAPTADORES. Intercambiables.
│   ├── tokens.ts                           InjectionTokens de Angular para cada contrato
│   ├── repositorio-citas-memoria.ts
│   ├── repositorio-citas-http.ts           Mismo contrato, conectado a API REST
│   ├── repositorio-horarios-memoria.ts     Agendas hospitalarias precargadas
│   ├── validador-reniec-simulado.ts        Simulador de verificación de identidad
│   ├── notificador-consola.ts
│   └── notificador-correo.ts               Mismo contrato, con despacho SMTP
│
├── presentacion/               ← COMPONENTES ANGULAR
│   └── app.component.ts        Interfaz de usuario para reservar turnos médicos
│
├── app.config.ts               ← RAÍZ DE COMPOSICIÓN (Inyección de Dependencias)
└── pruebas/
    └── dominio.pruebas.ts      Pruebas automáticas puras en Node.js
```

---

## Los cuatro momentos para explicar en clase

### 1. El dominio no conoce Angular
Abra `dominio/modelos/cita.modelo.ts` o `dominio/modelos/paciente.modelo.ts` y compruebe que **no tienen ninguna importación externa** (ni `@angular/core`, ni `HttpClient`). Contienen reglas médicas que seguirían siendo verdaderas aunque el hospital gestionara las citas en fichas de papel.

### 2. El contrato vive en el dominio
Abra `dominio/contratos/repositorio-citas.contrato.ts`. El contrato está dentro de `dominio/`, no en infraestructura. Quien necesita el servicio (el dominio) es quien define el contrato formal.

### 3. El token es de Angular, el contrato no
Abra `infraestructura/tokens.ts`. Aquí sí aparece `@angular/core`, y por eso este archivo pertenece a **infraestructura**. Las interfaces de TypeScript desaparecen al compilar a JavaScript; por ello, Angular utiliza `InjectionToken` para resolver las implementaciones concretas en tiempo de ejecución.

### 4. La raíz de composición
Abra `app.config.ts`. Es el **único** archivo de toda la aplicación donde se eligen las implementaciones concretas. Cambiar de persistencia en memoria a una API REST remota, o del notificador de consola a un servidor de correo SMTP, se realiza modificando únicamente las líneas de este archivo.

---

## La demostración que cierra la clase

```bash
npm run pruebas
```

Las reglas de negocio (validación de DNI de 8 dígitos, copago gratuito para SIS, prevención de citas en fecha pasada, mínimo de 2 horas para cancelación y orquestación de reserva) se ejecutan y verifican en **menos de 50 milisegundos**, sin navegador, sin servidor web y sin base de datos.
