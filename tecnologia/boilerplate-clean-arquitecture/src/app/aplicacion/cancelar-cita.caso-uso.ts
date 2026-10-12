// =============================================================
// APLICACION — CASO DE USO: CANCELAR CITA MEDICA
// =============================================================
// Permite al paciente o al personal cancelar una cita reservada.
// SOLO DEPENDE DEL DOMINIO. NO IMPORTA ANGULAR.

import { RepositorioCitas } from '../dominio/contratos/repositorio-citas.contrato';
import { RepositorioHorarios } from '../dominio/contratos/repositorio-horarios.contrato';
import { NotificadorPaciente } from '../dominio/contratos/notificador-paciente.contrato';

export class CancelarCitaCasoUso {
  constructor(
    private readonly repositorioCitas: RepositorioCitas,
    private readonly repositorioHorarios: RepositorioHorarios,
    private readonly notificador: NotificadorPaciente
  ) {}

  async ejecutar(citaId: string, motivo: string, correoNotificacion?: string): Promise<void> {
    const cita = await this.repositorioCitas.buscarPorId(citaId);
    if (!cita) {
      throw new Error(`No se encontro la cita medica con identificador ${citaId}`);
    }

    // Calcular las horas de anticipacion respecto a la hora de la cita
    const diferenciaMs = cita.horario.fechaHora.getTime() - Date.now();
    const anticipacionHoras = diferenciaMs / (1000 * 60 * 60);

    // Invocar regla del dominio (valida anticipacion >= 2 horas y no atendida)
    cita.cancelar(motivo, anticipacionHoras);

    // Actualizar persistencia
    await this.repositorioCitas.actualizar(cita);
    await this.repositorioHorarios.actualizarEstado(cita.horario.cupoId, false);

    // Enviar notificacion si hay correo
    if (correoNotificacion) {
      await this.notificador.notificarCitaCancelada(cita, correoNotificacion, motivo);
    }
  }
}
