// =============================================================
// PRUEBAS DEL DOMINIO — SIN ANGULAR NI NAVEGADOR
// =============================================================
// Este archivo se compila y se ejecuta con Node y TypeScript
// puro, SIN Angular, SIN navegador y SIN base de datos.
//
// Demuestra que el dominio y los casos de uso estan 100% aislados
// de la infraestructura. Si alguna capa importara @angular/core,
// este archivo fallaria al compilar con tsconfig.pruebas.json.

import assert from 'assert';
import { Paciente } from '../dominio/modelos/paciente.modelo';
import { HorarioCupo } from '../dominio/modelos/horario-cupo.modelo';
import { Cita } from '../dominio/modelos/cita.modelo';
import { calcularCopagoPaciente } from '../dominio/modelos/tarifas-hospital';
import { ReservarCitaCasoUso } from '../aplicacion/reservar-cita.caso-uso';
import { CancelarCitaCasoUso } from '../aplicacion/cancelar-cita.caso-uso';
import { RepositorioCitasMemoria } from '../infraestructura/repositorio-citas-memoria';
import { RepositorioHorariosMemoria } from '../infraestructura/repositorio-horarios-memoria';
import { NotificadorConsola } from '../infraestructura/notificador-consola';

let pruebasPasadas = 0;

async function test(descripcion: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    pruebasPasadas++;
    console.log(`  [OK] ${descripcion}`);
  } catch (error: any) {
    console.error(`  [FALLO] ${descripcion}: ${error.message}`);
    process.exitCode = 1;
  }
}

function crearCupoFuturo(cupoId = 'CUP-TEST-1', horasAdelanto = 24): HorarioCupo {
  const fecha = new Date(Date.now() + horasAdelanto * 3600 * 1000);
  return new HorarioCupo(
    cupoId,
    'ESP-CAR',
    'Cardiología',
    'MED-01',
    'Dr. Carlos Mendoza',
    'Consultorio 201',
    fecha
  );
}

async function ejecutarPruebas(): Promise<void> {
  console.log('\n=== EJECUTANDO PRUEBAS DE DOMINIO Y CASOS DE USO (HRA) ===\n');

  // Prueba 1: Validacion de DNI
  await test('Paciente rechaza DNI con formato invalido (RN-PAC-01)', () => {
    assert.throws(() => {
      new Paciente('P1', '123', 'Juan', 'Perez', 'j@m.com', '999', 'SIS');
    }, /RN-PAC-01/);
  });

  // Prueba 2: Copago del SIS es 0
  await test('Tarifas hospitalarias: paciente SIS tiene copago S/. 0.00', () => {
    const copago = calcularCopagoPaciente('SIS', 30.0);
    assert.strictEqual(copago, 0.0);
  });

  // Prueba 3: Copago Particular paga tarifa completa
  await test('Tarifas hospitalarias: paciente PARTICULAR paga arancel hospitalario', () => {
    const copago = calcularCopagoPaciente('PARTICULAR', 35.0);
    assert.strictEqual(copago, 35.0);
  });

  // Prueba 4: Cita no se puede crear en fecha pasada
  await test('Cita medica no permite turnos con fecha pasada (RN-CIT-02)', () => {
    const fechaPasada = new Date(Date.now() - 3600 * 1000);
    const cupoVencido = new HorarioCupo('C-V', 'E1', 'General', 'M1', 'Dr. A', '101', fechaPasada);

    assert.throws(() => {
      Cita.crear('CIT-01', 'PAC-01', cupoVencido, 0.0);
    }, /RN-CIT-02/);
  });

  // Prueba 5: No se puede cancelar cita con menos de 2 horas de anticipacion
  await test('Cita medica exige minimo 2 horas de anticipacion para cancelar (RN-CIT-08)', () => {
    const cupo = crearCupoFuturo();
    const cita = Cita.crear('CIT-02', 'PAC-01', cupo, 0.0);

    assert.throws(() => {
      cita.cancelar('Imprevisto de transporte', 1.5); // 1.5 horas
    }, /RN-CIT-08/);
  });

  // Prueba 6: Caso de uso ReservarCita completo
  await test('Caso de uso ReservarCita: orquesta reserva, marca cupo ocupado y notifica', async () => {
    const repoCitas = new RepositorioCitasMemoria();
    const repoHorarios = new RepositorioHorariosMemoria();
    const notificador = new NotificadorConsola();
    const casoUso = new ReservarCitaCasoUso(repoCitas, repoHorarios, notificador);

    const paciente = new Paciente(
      'PAC-01',
      '74859612',
      'Maria',
      'Gonzales Diaz',
      'maria@correo.com',
      '987654321',
      'SIS'
    );

    const cita = await casoUso.ejecutar({
      citaId: 'CIT-777',
      paciente,
      cupoId: 'CUP-001',
    });

    assert.strictEqual(cita.id, 'CIT-777');
    assert.strictEqual(cita.estado, 'PROGRAMADA');
    assert.strictEqual(cita.copago, 0.0);

    const guardada = await repoCitas.buscarPorId('CIT-777');
    assert.ok(guardada !== null);
    assert.strictEqual(guardada?.id, 'CIT-777');
  });

  console.log(`\n Total de pruebas pasadas exitosamente: ${pruebasPasadas}/6\n`);
}

ejecutarPruebas();
