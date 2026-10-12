// =============================================================
// DOMINIO — MODELO DE PACIENTE
// =============================================================
// Esta clase representa a la persona que recibe atencion medica.
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

export type TipoSeguro = 'SIS' | 'PARTICULAR' | 'ESSALUD';

export class Paciente {
  constructor(
    readonly id: string,
    readonly dni: string,
    readonly nombres: string,
    readonly apellidos: string,
    readonly correo: string,
    readonly telefono: string,
    readonly tipoSeguro: TipoSeguro
  ) {
    if (!dni || !/^\d{8}$/.test(dni)) {
      throw new Error('RN-PAC-01: El DNI del paciente debe contener exactamente 8 digitos numericos');
    }
    if (!nombres || nombres.trim().length === 0) {
      throw new Error('RN-PAC-02: El paciente debe tener un nombre registrado');
    }
    if (!apellidos || apellidos.trim().length === 0) {
      throw new Error('RN-PAC-03: El paciente debe tener apellidos registrados');
    }
  }

  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }
}
