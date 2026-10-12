// =============================================================
// INFRAESTRUCTURA — ADAPTADOR: CITAS EN MEMORIA
// =============================================================
// Implementa el contrato RepositorioCitas para desarrollo y pruebas.

import { RepositorioCitas } from '../dominio/contratos/repositorio-citas.contrato';
import { Cita } from '../dominio/modelos/cita.modelo';

export class RepositorioCitasMemoria implements RepositorioCitas {
  private citas: Cita[] = [];

  async guardar(cita: Cita): Promise<void> {
    const existe = this.citas.findIndex((c) => c.id === cita.id);
    if (existe >= 0) {
      this.citas[existe] = cita;
    } else {
      this.citas.push(cita);
    }
  }

  async buscarPorId(id: string): Promise<Cita | null> {
    const encontrada = this.citas.find((c) => c.id === id);
    return encontrada || null;
  }

  async listarPorPaciente(pacienteId: string): Promise<Cita[]> {
    return this.citas.filter((c) => c.pacienteId === pacienteId);
  }

  async listarTodas(): Promise<Cita[]> {
    return [...this.citas];
  }

  async actualizar(cita: Cita): Promise<void> {
    await this.guardar(cita);
  }
}
