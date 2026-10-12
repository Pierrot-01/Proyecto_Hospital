// =============================================================
// RAIZ DE COMPOSICION — SISTEMA HOSPITALARIO HRA
// =============================================================
// Es el UNICO lugar de toda la aplicacion donde se decide que
// tecnologia concreta cumple cada contrato del hospital.
//
// Cambiar de adaptadores en memoria a una API REST, o del notificador
// de consola al servidor de correo SMTP, se logra cambiando
// UNA linea de este archivo. Ni el dominio ni los casos de uso se enteran.

import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, HttpClient } from '@angular/common/http';

// Tokens de contratos
import {
  REPOSITORIO_CITAS,
  REPOSITORIO_HORARIOS,
  NOTIFICADOR_PACIENTE,
  VALIDADOR_IDENTIDAD,
} from './infraestructura/tokens';

// Adaptadores de infraestructura
import { RepositorioCitasMemoria } from './infraestructura/repositorio-citas-memoria';
import { RepositorioCitasHttp } from './infraestructura/repositorio-citas-http';
import { RepositorioHorariosMemoria } from './infraestructura/repositorio-horarios-memoria';
import { NotificadorConsola } from './infraestructura/notificador-consola';
import { NotificadorCorreoInstitucional } from './infraestructura/notificador-correo';
import { ValidadorReniecSimulado } from './infraestructura/validador-reniec-simulado';

// Casos de uso de aplicacion
import { ConsultarDisponibilidadCasoUso } from './aplicacion/consultar-disponibilidad.caso-uso';
import { ReservarCitaCasoUso } from './aplicacion/reservar-cita.caso-uso';
import { CancelarCitaCasoUso } from './aplicacion/cancelar-cita.caso-uso';

// Contratos (tipos)
import { RepositorioCitas } from './dominio/contratos/repositorio-citas.contrato';
import { RepositorioHorarios } from './dominio/contratos/repositorio-horarios.contrato';
import { NotificadorPaciente } from './dominio/contratos/notificador-paciente.contrato';

const URL_API = 'http://localhost:8080/api/v1';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    // =========================================================
    // ELECCION DE ADAPTADORES (INFRAESTRUCTURA)
    // Descomente la alternativa para cambiar de tecnologia.
    // =========================================================

    {
      provide: REPOSITORIO_CITAS,
      useFactory: () => new RepositorioCitasMemoria(),
      // ALTERNATIVA con API REST del backend:
      // useFactory: (http: HttpClient) => new RepositorioCitasHttp(http, URL_API),
      // deps: [HttpClient],
    },
    {
      provide: REPOSITORIO_HORARIOS,
      useFactory: () => new RepositorioHorariosMemoria(),
    },
    {
      provide: NOTIFICADOR_PACIENTE,
      useFactory: () => new NotificadorConsola(),
      // ALTERNATIVA con envio de correo institucional:
      // useFactory: () => new NotificadorCorreoInstitucional(),
    },
    {
      provide: VALIDADOR_IDENTIDAD,
      useFactory: () => new ValidadorReniecSimulado(),
    },

    // =========================================================
    // CASOS DE USO (APLICACION)
    // Reciben solo contratos (interfaces), nunca implementaciones concretas.
    // =========================================================

    {
      provide: ConsultarDisponibilidadCasoUso,
      useFactory: (repositorio: RepositorioHorarios) =>
        new ConsultarDisponibilidadCasoUso(repositorio),
      deps: [REPOSITORIO_HORARIOS],
    },
    {
      provide: ReservarCitaCasoUso,
      useFactory: (
        repoCitas: RepositorioCitas,
        repoHorarios: RepositorioHorarios,
        notificador: NotificadorPaciente
      ) => new ReservarCitaCasoUso(repoCitas, repoHorarios, notificador),
      deps: [REPOSITORIO_CITAS, REPOSITORIO_HORARIOS, NOTIFICADOR_PACIENTE],
    },
    {
      provide: CancelarCitaCasoUso,
      useFactory: (
        repoCitas: RepositorioCitas,
        repoHorarios: RepositorioHorarios,
        notificador: NotificadorPaciente
      ) => new CancelarCitaCasoUso(repoCitas, repoHorarios, notificador),
      deps: [REPOSITORIO_CITAS, REPOSITORIO_HORARIOS, NOTIFICADOR_PACIENTE],
    },
  ],
};
