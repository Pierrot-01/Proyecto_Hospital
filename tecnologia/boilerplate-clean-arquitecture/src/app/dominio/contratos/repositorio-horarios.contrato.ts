// =============================================================
// DOMINIO — CONTRATO: REPOSITORIO DE HORARIOS Y CUPOS
// =============================================================
// Permite consultar los turnos disponibles por especialidad y medico.
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

import { HorarioCupo } from '../modelos/horario-cupo.modelo';

export interface RepositorioHorarios {
  listarCuposDisponibles(especialidadId?: string): Promise<HorarioCupo[]>;
  buscarPorId(cupoId: string): Promise<HorarioCupo | null>;
  actualizarEstado(cupoId: string, ocupado: boolean): Promise<void>;
}
