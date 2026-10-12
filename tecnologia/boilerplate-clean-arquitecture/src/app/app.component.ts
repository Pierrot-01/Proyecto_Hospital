// =============================================================
// PRESENTACION — COMPONENTE PRINCIPAL (SHELL HRA)
// =============================================================
// Muestra la demostracion inicial del flujo de reserva de citas
// consumiendo los casos de uso a traves de inyeccion de dependencias.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultarDisponibilidadCasoUso } from './aplicacion/consultar-disponibilidad.caso-uso';
import { ReservarCitaCasoUso } from './aplicacion/reservar-cita.caso-uso';
import { HorarioCupo } from './dominio/modelos/horario-cupo.modelo';
import { Paciente } from './dominio/modelos/paciente.modelo';
import { Cita } from './dominio/modelos/cita.modelo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 900px; margin: 40px auto; padding: 24px; font-family: sans-serif; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <header style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="color: #0f172a; margin: 0 0 8px 0; font-size: 24px;">Hospital Regional Docente de Las Mercedes (HRA)</h1>
        <p style="color: #64748b; margin: 0;">Boilerplate Arquitectura Limpia · Demostración Asistencial de Citas Médicas</p>
      </header>

      <section style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; color: #1e293b; margin-bottom: 12px;">Cupos Disponibles en Consulta Externa</h2>
        <div *ngIf="cargando" style="color: #64748b;">Cargando agendas médicas...</div>

        <div *ngFor="let cupo of cuposDisponibles" style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; margin-bottom: 8px;">
          <div>
            <strong style="color: #0284c7;">{{ cupo.especialidadNombre }}</strong> — {{ cupo.medicoNombre }}<br>
            <small style="color: #64748b;">{{ cupo.consultorio }} | {{ cupo.fechaHora | date:'medium' }}</small>
          </div>
          <button (click)="reservar(cupo)" style="background: #0284c7; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 500;">
            Reservar Turno
          </button>
        </div>
      </section>

      <section *ngIf="citaConfirmada" style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 16px; border-radius: 6px;">
        <h3 style="color: #065f46; margin: 0 0 8px 0;">¡Cita Médica Reservada Exitosamente!</h3>
        <p style="margin: 0; color: #047857;">
          Código de Cita: <strong>{{ citaConfirmada.id }}</strong><br>
          Estado: <strong>{{ citaConfirmada.estado }}</strong> | Copago: <strong>S/. {{ citaConfirmada.copago.toFixed(2) }} (SIS)</strong>
        </p>
      </section>
    </div>
  `
})
export class AppComponent implements OnInit {
  cuposDisponibles: HorarioCupo[] = [];
  cargando = true;
  citaConfirmada: Cita | null = null;

  constructor(
    private readonly consultarDisponibilidad: ConsultarDisponibilidadCasoUso,
    private readonly reservarCita: ReservarCitaCasoUso
  ) {}

  async ngOnInit(): Promise<void> {
    await this.cargarCupos();
  }

  async cargarCupos(): Promise<void> {
    this.cargando = true;
    this.cuposDisponibles = await this.consultarDisponibilidad.ejecutar();
    this.cargando = false;
  }

  async reservar(cupo: HorarioCupo): Promise<void> {
    try {
      const pacienteDemo = new Paciente(
        'PAC-1001',
        '45892314',
        'Carlos',
        'Mendoza Benites',
        'carlos.mendoza@gmail.com',
        '974821365',
        'SIS'
      );

      this.citaConfirmada = await this.reservarCita.ejecutar({
        citaId: 'CIT-' + Math.floor(1000 + Math.random() * 9000),
        paciente: pacienteDemo,
        cupoId: cupo.cupoId
      });

      await this.cargarCupos();
    } catch (error: any) {
      alert(error.message);
    }
  }
}
