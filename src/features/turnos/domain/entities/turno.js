export const ESTADO_INICIAL_TURNO = {
  salonId: "",
  monitorId: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
};

export function crearTurnoDesdeFormulario(campos) {
  return {
    salaId: campos.salonId,
    monitorId: campos.monitorId,
    fecha: campos.fecha,
    horaInicioPlan: campos.horaInicio,
    horaFinPlan: campos.horaFin,
  };
}

export const ESTADOS_TURNO = [
  "pendiente_aprobacion",
  "aprobado",
  "rechazado",
  "en_curso",
  "cancelado",
  "finalizado",
];

export const TRANSICIONES_VALIDAS = {
  pendiente_aprobacion: ["aprobado", "rechazado"],
  aprobado: ["en_curso", "cancelado", "pendiente_aprobacion"],
  en_curso: ["finalizado"],
  finalizado: [],
  cancelado: [],
  rechazado: [],
};

export const ESTADO_INICIAL_CAMBIO_ESTADO = {
  turnoId: "",
  estado: "",
  coordinadorId: "",
};

export function formatearTurnoPendiente(turno) {
  const sala = turno.sala?.nombre ?? "Sala desconocida";
  const sede = turno.sede?.nombre ? ` (${turno.sede.nombre})` : "";
  const monitor = turno.monitor?.nombre ?? "Monitor desconocido";
  return `${sala}${sede} — ${monitor} — ${turno.fecha} ${turno.horaInicioPlan}-${turno.horaFinPlan}`;
}
