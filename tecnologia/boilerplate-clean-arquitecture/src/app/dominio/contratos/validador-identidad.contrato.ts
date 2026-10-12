// =============================================================
// DOMINIO — CONTRATO: VALIDADOR DE IDENTIDAD (RENIEC)
// =============================================================
// Define la operacion de verificacion de identidad del ciudadano.
// NO IMPORTA ANGULAR NI LIBRERIAS EXTERNAS.

export interface DatosIdentidad {
  dni: string;
  nombres: string;
  apellidos: string;
  esValido: boolean;
}

export interface ValidadorIdentidad {
  validarDni(dni: string): Promise<DatosIdentidad>;
}
