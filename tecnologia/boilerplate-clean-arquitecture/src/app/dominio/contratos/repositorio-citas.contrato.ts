// =============================================================
// DOMINIO — CONTRATO: REPOSITORIO DE CITAS
// =============================================================
// Define QUE operaciones de citas necesita el dominio, no COMO se guardan.
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

import { Cita } from '../modelos/cita.modelo';

export interface RepositorioCitas {
  guardar(cita: Cita): Promise<void>;
  buscarPorId(id: string): Promise<Cita | null>;
  listarPorPaciente(pacienteId: string): Promise<Cita[]>;
  listarTodas(): Promise<Cita[]>;
  actualizar(cita: Cita): Promise<void>;
}
