// =============================================================
// INFRAESTRUCTURA — TOKENS DE INYECCION PARA ANGULAR
// =============================================================
// Como las interfaces de TypeScript desaparecen al compilar a JS,
// Angular necesita un InjectionToken concreto para resolver
// cada contrato.
//
// Este archivo esta en INFRAESTRUCTURA porque importa @angular/core.
// Los contratos siguen limpios en el dominio.

import { InjectionToken } from '@angular/core';
import { RepositorioCitas } from '../dominio/contratos/repositorio-citas.contrato';
import { RepositorioHorarios } from '../dominio/contratos/repositorio-horarios.contrato';
import { NotificadorPaciente } from '../dominio/contratos/notificador-paciente.contrato';
import { ValidadorIdentidad } from '../dominio/contratos/validador-identidad.contrato';

export const REPOSITORIO_CITAS = new InjectionToken<RepositorioCitas>(
  'REPOSITORIO_CITAS'
);

export const REPOSITORIO_HORARIOS = new InjectionToken<RepositorioHorarios>(
  'REPOSITORIO_HORARIOS'
);

export const NOTIFICADOR_PACIENTE = new InjectionToken<NotificadorPaciente>(
  'NOTIFICADOR_PACIENTE'
);

export const VALIDADOR_IDENTIDAD = new InjectionToken<ValidadorIdentidad>(
  'VALIDADOR_IDENTIDAD'
);
