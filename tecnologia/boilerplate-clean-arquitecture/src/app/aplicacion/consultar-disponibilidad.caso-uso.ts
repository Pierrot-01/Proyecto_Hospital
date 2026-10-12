// =============================================================
// APLICACION — CASO DE USO: CONSULTAR DISPONIBILIDAD
// =============================================================
// Coordina la busqueda de cupos y horarios para el paciente.
// SOLO DEPENDE DEL DOMINIO. NO IMPORTA ANGULAR.

import { RepositorioHorarios } from '../dominio/contratos/repositorio-horarios.contrato';
import { HorarioCupo } from '../dominio/modelos/horario-cupo.modelo';

export class ConsultarDisponibilidadCasoUso {
  constructor(private readonly repositorioHorarios: RepositorioHorarios) {}

  async ejecutar(especialidadId?: string): Promise<HorarioCupo[]> {
    const cupos = await this.repositorioHorarios.listarCuposDisponibles(especialidadId);
    // Filtrar unicamente turnos con fecha futura y que no esten ocupados
    return cupos.filter((c) => c.esFuturo() && !c.ocupado);
  }
}
