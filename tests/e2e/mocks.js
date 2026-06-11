export const DISPONIBILIDAD_LANS = {
  sede: "LANS",
  consultadaEn: "2026-06-11T17:13:05.108Z",
  salas: [
    { id: "sala-lans-001", nombre: "Sala 1", estado: "libre" },
    { id: "sala-lans-002", nombre: "Sala 2", estado: "en_monitoria" },
    { id: "sala-lans-mac", nombre: "MAC", estado: "restringida" },
  ],
};

export const DISPONIBILIDAD_CENTRAL = {
  sede: "CENTRAL",
  consultadaEn: "2026-06-11T17:20:00.000Z",
  salas: [
    { id: "sala-central-001", nombre: "Sala 1", estado: "libre" },
    { id: "sala-central-002", nombre: "Sala 2", estado: "libre" },
    { id: "sala-central-mac", nombre: "MAC", estado: "restringida" },
  ],
};

export async function mockDisponibilidad(page, { lans = DISPONIBILIDAD_LANS, central = DISPONIBILIDAD_CENTRAL } = {}) {
  await page.route("**/salas/*/disponibilidad", async (route) => {
    const url = route.request().url();

    if (url.includes("sede-central-001")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(central) });
      return;
    }

    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(lans) });
  });
}

export const TURNOS_PENDIENTES = [
  {
    id: "turno-seed-001",
    monitor: { id: "monitor-001", nombre: "Mariana López", email: "mariana.lopez35806@ucaldas.edu.co" },
    sala: { id: "sala-lans-001", nombre: "Sala 1" },
    sede: { id: "sede-lans-001", nombre: "LANS" },
    fecha: "2025-06-12",
    horaInicioPlan: "10:00",
    horaFinPlan: "12:00",
    horasPlanificadas: 2,
    createdAt: "2026-06-11T17:00:00.000Z",
  },
];

export async function mockTurnosPendientes(page, pendientes = TURNOS_PENDIENTES) {
  await page.route("**/turnos/pendientes", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(pendientes) });
  });
}
