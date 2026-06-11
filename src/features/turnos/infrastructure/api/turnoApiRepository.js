import { TurnoRepository } from "../../domain/turnoRepository";
import { API_BASE_URL } from "../../../../shared/config/env";

export class TurnoApiRepository extends TurnoRepository {
  async crear(turno) {
    const res = await fetch(`${API_BASE_URL}/turnos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(turno),
    });

    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }
}

export const turnoApiRepository = new TurnoApiRepository();
