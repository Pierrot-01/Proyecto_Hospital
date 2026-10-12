// =============================================================
// INFRAESTRUCTURA — ADAPTADOR: VALIDADOR RENIEC SIMULADO
// =============================================================
// Simula la consulta externa del DNI para registro de pacientes.

import { ValidadorIdentidad, DatosIdentidad } from '../dominio/contratos/validador-identidad.contrato';

export class ValidadorReniecSimulado implements ValidadorIdentidad {
  async validarDni(dni: string): Promise<DatosIdentidad> {
    if (!/^\d{8}$/.test(dni)) {
      return { dni, nombres: '', apellidos: '', esValido: false };
    }
    // Simulacion de respuesta exitosa de padron de identidad
    return {
      dni,
      nombres: 'Juan Carlos',
      apellidos: 'Quispe Huamán',
      esValido: true,
    };
  }
}
