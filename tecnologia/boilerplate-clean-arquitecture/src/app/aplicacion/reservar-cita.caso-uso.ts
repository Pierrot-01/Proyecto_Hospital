// =============================================================
// APLICACION — CASO DE USO: RESERVAR CITA MEDICA
// =============================================================
// Orquesta los pasos del proceso asistencial de reserva.
// SOLO DEPENDE DEL DOMINIO. NO IMPORTA ANGULAR.

import { Cita } from '../dominio/modelos/cita.modelo';
import { Paciente } from '../dominio/modelos/paciente.modelo';
import { calcularCopagoPaciente } from '../dominio/modelos/tarifas-hospital';
import { RepositorioCitas } from '../dominio/contratos/repositorio-citas.contrato';
import { RepositorioHorarios } from '../dominio/contratos/repositorio-horarios.contrato';
import { NotificadorPaciente } from '../dominio/contratos/notificador-paciente.contrato';

export interface ParametrosReserva {
  citaId: string;
  paciente: Paciente;
  cupoId: string;
}

export class ReservarCitaCasoUso {
  constructor(
    private readonly repositorioCitas: RepositorioCitas,
    private readonly repositorioHorarios: RepositorioHorarios,
    private readonly notificador: NotificadorPaciente
  ) {}

  async ejecutar(params: ParametrosReserva): Promise<Cita> {
    const { citaId, paciente, cupoId } = params;

    // 1. Obtener el cupo medico
    const cupo = await this.repositorioHorarios.buscarPorId(cupoId);
    if (!cupo) {
      throw new Error('El turno seleccionado no existe en la agenda hospitalaria');
    }
    if (cupo.ocupado) {
      throw new Error('El turno ya fue asignado a otro paciente. Elija otro horario.');
    }

    // 2. Calcular copago segun reglas del hospital HRA
    const copago = calcularCopagoPaciente(paciente.tipoSeguro);

    // 3. Crear entidad de dominio (aplica reglas de negocio invariantes)
    const cita = Cita.crear(citaId, paciente.id, cupo, copago);

    // 4. Persistir la cita y actualizar el estado del cupo
    await this.repositorioCitas.guardar(cita);
    await this.repositorioHorarios.actualizarEstado(cupo.cupoId, true);

    // 5. Notificar de forma desacoplada al paciente
    await this.notificador.notificarCitaConfirmada(cita, paciente.correo);

    return cita;
  }
}
