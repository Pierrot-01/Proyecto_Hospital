// =============================================================
// INFRAESTRUCTURA — ADAPTADOR: NOTIFICADOR POR CORREO INSTITUCIONAL
// =============================================================
// Demuestra como se cambia de NotificadorConsola a Correo sin tocar el dominio.

import { NotificadorPaciente } from '../dominio/contratos/notificador-paciente.contrato';
import { Cita } from '../dominio/modelos/cita.modelo';

export class NotificadorCorreoInstitucional implements NotificadorPaciente {
  constructor(private readonly servidorSmtp: string = 'mail.hospitalmercedes.gob.pe') {}

  async notificarCitaConfirmada(cita: Cita, destinatario: string): Promise<boolean> {
    // Simula conexion TLS / envio por servidor SMTP institucional
    console.log(`[SMTP ${this.servidorSmtp}] Despachando correo a ${destinatario} con boleta de cita ${cita.id}`);
    return true;
  }

  async notificarCitaCancelada(cita: Cita, destinatario: string, motivo: string): Promise<boolean> {
    console.log(`[SMTP ${this.servidorSmtp}] Despachando cancelacion a ${destinatario} (Motivo: ${motivo})`);
    return true;
  }
}
