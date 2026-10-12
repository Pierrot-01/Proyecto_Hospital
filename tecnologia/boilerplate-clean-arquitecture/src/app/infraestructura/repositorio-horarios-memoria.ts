// =============================================================
// INFRAESTRUCTURA — ADAPTADOR: HORARIOS EN MEMORIA
// =============================================================
// Permite arrancar la aplicacion de inmediato sin base de datos.
// Implementa el contrato RepositorioHorarios.

import { RepositorioHorarios } from '../dominio/contratos/repositorio-horarios.contrato';
import { HorarioCupo } from '../dominio/modelos/horario-cupo.modelo';

export class RepositorioHorariosMemoria implements RepositorioHorarios {
  private cupos: HorarioCupo[] = [];

  constructor() {
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    const hora9 = new Date(manana);
    hora9.setHours(9, 0, 0, 0);

    const hora10 = new Date(manana);
    hora10.setHours(10, 0, 0, 0);

    const hora11 = new Date(manana);
    hora11.setHours(11, 0, 0, 0);

    const pasadoManana = new Date(manana);
    pasadoManana.setDate(pasadoManana.getDate() + 1);
    const hora15 = new Date(pasadoManana);
    hora15.setHours(15, 30, 0, 0);

    this.cupos = [
      new HorarioCupo(
        'CUP-001',
        'ESP-MED-GEN',
        'Medicina General',
        'MED-101',
        'Dra. Patricia Ramos (CMP 45120)',
        'Consultorio 104 - Pabellón A',
        hora9
      ),
      new HorarioCupo(
        'CUP-002',
        'ESP-MED-GEN',
        'Medicina General',
        'MED-101',
        'Dra. Patricia Ramos (CMP 45120)',
        'Consultorio 104 - Pabellón A',
        hora10
      ),
      new HorarioCupo(
        'CUP-003',
        'ESP-CAR',
        'Cardiología',
        'MED-202',
        'Dr. Carlos Mendoza (CMP 32890)',
        'Consultorio 208 - Pabellón Especialidades',
        hora11
      ),
      new HorarioCupo(
        'CUP-004',
        'ESP-PED',
        'Pediatría',
        'MED-303',
        'Dr. Jorge Benítez (CMP 51240)',
        'Consultorio 112 - Pabellón Infantil',
        hora15
      ),
    ];
  }

  async listarCuposDisponibles(especialidadId?: string): Promise<HorarioCupo[]> {
    if (especialidadId) {
      return this.cupos.filter(
        (c) => c.especialidadId === especialidadId && !c.ocupado
      );
    }
    return this.cupos.filter((c) => !c.ocupado);
  }

  async buscarPorId(cupoId: string): Promise<HorarioCupo | null> {
    const encontrado = this.cupos.find((c) => c.cupoId === cupoId);
    return encontrado || null;
  }

  async actualizarEstado(cupoId: string, ocupado: boolean): Promise<void> {
    const cupo = this.cupos.find((c) => c.cupoId === cupoId);
    if (cupo) {
      if (ocupado) {
        cupo.marcarOcupado();
      } else {
        cupo.liberar();
      }
    }
  }
}
