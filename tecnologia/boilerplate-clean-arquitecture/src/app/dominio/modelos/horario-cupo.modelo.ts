// =============================================================
// DOMINIO — OBJETO DE VALOR HORARIO / CUPO MEDICO
// =============================================================
// Representa el turno disponible para la atencion ambulatoria.
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

export class HorarioCupo {
  constructor(
    readonly cupoId: string,
    readonly especialidadId: string,
    readonly especialidadNombre: string,
    readonly medicoId: string,
    readonly medicoNombre: string,
    readonly consultorio: string,
    readonly fechaHora: Date,
    private _ocupado: boolean = false
  ) {}

  get ocupado(): boolean {
    return this._ocupado;
  }

  marcarOcupado(): void {
    if (this._ocupado) {
      throw new Error('RN-HOR-01: El cupo ya se encuentra asignado a otro paciente');
    }
    this._ocupado = true;
  }

  liberar(): void {
    this._ocupado = false;
  }

  esFuturo(): boolean {
    return this.fechaHora.getTime() > Date.now();
  }

  get claveConcurrencia(): string {
    return `cupo:${this.medicoId}:${this.fechaHora.toISOString()}`;
  }
}
