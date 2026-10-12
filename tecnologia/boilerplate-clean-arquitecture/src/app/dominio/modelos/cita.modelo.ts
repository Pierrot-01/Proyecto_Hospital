// =============================================================
// DOMINIO — ENTIDAD CITA MEDICA
// =============================================================
// Contiene las reglas invariantes de la cita hospitalaria.
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

import { HorarioCupo } from './horario-cupo.modelo';

export type EstadoCita = 'PROGRAMADA' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';

export class Cita {
  private constructor(
    readonly id: string,
    readonly pacienteId: string,
    readonly horario: HorarioCupo,
    private _estado: EstadoCita,
    readonly copago: number,
    private _motivoCancelacion?: string
  ) {}

  static crear(
    id: string,
    pacienteId: string,
    horario: HorarioCupo,
    copago: number
  ): Cita {
    if (!pacienteId) {
      throw new Error('RN-CIT-01: La cita médica debe tener un paciente asignado');
    }
    if (!horario.esFuturo()) {
      throw new Error('RN-CIT-02: La fecha y hora de la cita deben ser futuras');
    }
    if (horario.ocupado) {
      throw new Error('RN-CIT-03: No se puede agendar una cita sobre un cupo ocupado');
    }

    horario.marcarOcupado();
    return new Cita(id, pacienteId, horario, 'PROGRAMADA', copago);
  }

  get estado(): EstadoCita {
    return this._estado;
  }

  get motivoCancelacion(): string | undefined {
    return this._motivoCancelacion;
  }

  confirmar(): void {
    if (this._estado !== 'PROGRAMADA') {
      throw new Error('RN-CIT-04: Solo una cita en estado PROGRAMADA puede confirmarse');
    }
    this._estado = 'CONFIRMADA';
  }

  marcarAtendida(): void {
    if (this._estado !== 'CONFIRMADA') {
      throw new Error('RN-CIT-05: Solo una cita confirmada puede registrarse como atendida');
    }
    this._estado = 'ATENDIDA';
  }

  cancelar(motivo: string, anticipacionHoras: number): void {
    if (this._estado === 'ATENDIDA') {
      throw new Error('RN-CIT-06: No se puede cancelar una cita que ya fue atendida por el médico');
    }
    if (this._estado === 'CANCELADA') {
      throw new Error('RN-CIT-07: La cita médica ya se encuentra cancelada');
    }
    if (anticipacionHoras < 2) {
      throw new Error('RN-CIT-08: La cancelación debe realizarse con un mínimo de 2 horas de anticipación');
    }

    this._estado = 'CANCELADA';
    this._motivoCancelacion = motivo;
    this.horario.liberar();
  }
}
