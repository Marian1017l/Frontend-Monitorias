import { useState } from "react";
import { ESTADO_INICIAL_TURNO, crearTurnoDesdeFormulario } from "../domain/entities/turno";
import { turnoApiRepository } from "../infrastructure/api/turnoApiRepository";
import { SALONES_MOCK } from "../infrastructure/mocks/salones.mock";
import { MONITORES_MOCK } from "../infrastructure/mocks/monitores.mock";

export function useAsignarTurno(repository = turnoApiRepository) {
  const [campos, setCampos] = useState(ESTADO_INICIAL_TURNO);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const salones = SALONES_MOCK;
  const monitores = MONITORES_MOCK;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCampos((prev) => ({ ...prev, [name]: value }));
    setFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setFeedback(null);

    try {
      const { status, data } = await repository.crear(crearTurnoDesdeFormulario(campos));

      if (status === 201) {
        const salon = salones.find((s) => s.id === campos.salonId);
        const monitor = monitores.find((m) => m.id === campos.monitorId);
        setFeedback({
          tipo: "exito",
          mensaje: `Turno asignado: ${salon?.nombre} — ${monitor?.nombre} — ${campos.fecha} de ${campos.horaInicio} a ${campos.horaFin} (${data?.estado ?? "pendiente_aprobacion"})`,
        });
        setCampos(ESTADO_INICIAL_TURNO);
        return;
      }

      if (status === 400 || status === 404 || status === 409 || status === 422) {
        setFeedback({ tipo: "error", mensaje: data?.detalle ?? "No se pudo asignar el turno." });
        return;
      }

      setFeedback({ tipo: "error", mensaje: "Error inesperado. Intenta de nuevo." });
    } catch {
      setFeedback({ tipo: "error", mensaje: "No se pudo conectar con el servidor." });
    } finally {
      setEnviando(false);
    }
  };

  return { campos, salones, monitores, enviando, feedback, handleChange, handleSubmit };
}
