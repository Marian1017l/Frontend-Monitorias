import { DisponibilidadRepository } from "../../domain/disponibilidadRepository";
import { API_BASE_URL } from "../../../../shared/config/env";

export class DisponibilidadApiRepository extends DisponibilidadRepository {
  async obtenerPorSede(sedeId) {
    const res = await fetch(`${API_BASE_URL}/salas/${sedeId}/disponibilidad`);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }
}

export const disponibilidadApiRepository = new DisponibilidadApiRepository();
