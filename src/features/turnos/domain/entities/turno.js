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
