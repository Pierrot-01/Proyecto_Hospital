// =============================================================
// INFRAESTRUCTURA — ADAPTADOR: CITAS MEDIANTE API REST
// =============================================================
// Implementa el MISMO contrato RepositorioCitas llamando al backend HTTP.
// Se puede intercambiar en app.config.ts sin tocar el dominio.

import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { RepositorioCitas } from '../dominio/contratos/repositorio-citas.contrato';
import { Cita } from '../dominio/modelos/cita.modelo';

export class RepositorioCitasHttp implements RepositorioCitas {
  constructor(
    private readonly http: HttpClient,
    private readonly baseUrl: string
  ) {}

  async guardar(cita: Cita): Promise<void> {
    const payload = {
      id: cita.id,
      pacienteId: cita.pacienteId,
      cupoId: cita.horario.cupoId,
      estado: cita.estado,
      copago: cita.copago
    };
    await firstValueFrom(this.http.post<void>(`${this.baseUrl}/citas`, payload));
  }

  async buscarPorId(id: string): Promise<Cita | null> {
    try {
      const data = await firstValueFrom(this.http.get<any>(`${this.baseUrl}/citas/${id}`));
      return data as Cita;
    } catch {
      return null;
    }
  }

  async listarPorPaciente(pacienteId: string): Promise<Cita[]> {
    const data = await firstValueFrom(
      this.http.get<any[]>(`${this.baseUrl}/pacientes/${pacienteId}/citas`)
    );
    return data as Cita[];
  }

  async listarTodas(): Promise<Cita[]> {
    const data = await firstValueFrom(this.http.get<any[]>(`${this.baseUrl}/citas`));
    return data as Cita[];
  }

  async actualizar(cita: Cita): Promise<void> {
    await firstValueFrom(
      this.http.put<void>(`${this.baseUrl}/citas/${cita.id}`, {
        estado: cita.estado,
        motivoCancelacion: cita.motivoCancelacion
      })
    );
  }
}
