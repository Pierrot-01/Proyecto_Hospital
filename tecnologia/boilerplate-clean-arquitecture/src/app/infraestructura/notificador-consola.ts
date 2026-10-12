// =============================================================
// INFRAESTRUCTURA — ADAPTADOR: NOTIFICADOR POR CONSOLA
// =============================================================
// Implementa el contrato NotificadorPaciente imprimiendo en consola.

import { NotificadorPaciente } from '../dominio/contratos/notificador-paciente.contrato';
import { Cita } from '../dominio/modelos/cita.modelo';

export class NotificadorConsola implements NotificadorPaciente {
  async notificarCitaConfirmada(cita: Cita, destinatario: string): Promise<boolean> {
    console.log('----------------------------------------------------');
    console.log(`[HRA NOTIFICACION] CITA CONFIRMADA EXITOSAMENTE`);
    console.log(`Para: ${destinatario}`);
    console.log(`Cita N°: ${cita.id}`);
    console.log(`Especialidad: ${cita.horario.especialidadNombre}`);
    console.log(`Médico: ${cita.horario.medicoNombre}`);
    console.log(`Fecha/Hora: ${cita.horario.fechaHora.toLocaleString('es-PE')}`);
    console.log(`Copago Asistencial: S/. ${cita.copago.toFixed(2)}`);
    console.log('----------------------------------------------------');
    return true;
  }

  async notificarCitaCancelada(cita: Cita, destinatario: string, motivo: string): Promise<boolean> {
    console.log('----------------------------------------------------');
    console.log(`[HRA NOTIFICACION] CITA CANCELADA`);
    console.log(`Para: ${destinatario}`);
    console.log(`Cita N°: ${cita.id}`);
    console.log(`Motivo: ${motivo}`);
    console.log('----------------------------------------------------');
    return true;
  }
}
