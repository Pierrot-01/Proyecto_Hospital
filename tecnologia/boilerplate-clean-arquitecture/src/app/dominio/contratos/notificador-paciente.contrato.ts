// =============================================================
// DOMINIO — CONTRATO: NOTIFICADOR AL PACIENTE
// =============================================================
// Contrato para enviar avisos al paciente (correo, SMS, etc.).
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

import { Cita } from '../modelos/cita.modelo';

export interface NotificadorPaciente {
  notificarCitaConfirmada(cita: Cita, destinatario: string): Promise<boolean>;
  notificarCitaCancelada(cita: Cita, destinatario: string, motivo: string): Promise<boolean>;
}
