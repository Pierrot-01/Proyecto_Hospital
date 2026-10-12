// =============================================================
// DOMINIO — REGLAS TARIFARIAS DEL HOSPITAL HRA
// =============================================================
// Centraliza el calculo de copagos segun tipo de seguro en UN SOLO LUGAR.
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

import { TipoSeguro } from './paciente.modelo';

export const TARIFA_CONSULTA_GENERAL = 20.0;
export const TARIFA_CONSULTA_ESPECIALIDAD = 40.0;

export function calcularCopagoPaciente(
  tipoSeguro: TipoSeguro,
  tarifaBase: number = TARIFA_CONSULTA_GENERAL
): number {
  if (tipoSeguro === 'SIS') {
    // Cobertura completa del Estado para pacientes SIS
    return 0.0;
  }
  if (tipoSeguro === 'ESSALUD') {
    // Copago por convenio interinstitucional MINSA-ESSALUD
    return 10.0;
  }
  // Paciente particular paga el arancel hospitalario completo
  return tarifaBase;
}
