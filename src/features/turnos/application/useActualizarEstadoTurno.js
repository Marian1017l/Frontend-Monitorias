import { useEffect, useState } from "react";
import { ESTADO_INICIAL_CAMBIO_ESTADO, ESTADOS_TURNO } from "../domain/entities/turno";
import { turnoApiRepository } from "../infrastructure/api/turnoApiRepository";
import { COORDINADORES_MOCK } from "../infrastructure/mocks/coordinadores.mock";

export function useActualizarEstadoTurno(repository = turnoApiRepository) {
  const [campos, setCampos] = useState(ESTADO_INICIAL_CAMBIO_ESTADO);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [pendientes, setPendientes] = useState([]);
  const [cargandoPendientes, setCargandoPendientes] = useState(false);

  const estados = ESTADOS_TURNO;
  const coordinadores = COORDINADORES_MOCK;

  const cargarPendientes = async () => {
    setCargandoPendientes(true);
    try {
      const { status, data } = await repository.obtenerPendientes();
      if (status === 200) setPendientes(data ?? []);
    } catch {
      // si falla, el formulario sigue disponible para ingresar el ID manualmente
    } finally {
      setCargandoPendientes(false);
    }
  };

  useEffect(() => {
    cargarPendientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const { status, data } = await repository.actualizarEstado(
        campos.turnoId,
        campos.estado,
        campos.coordinadorId || undefined
      );

      if (status === 200) {
        setFeedback({
          tipo: "exito",
          mensaje: `Turno ${data.id}: ${data.estadoAnterior} → ${data.estadoNuevo}`,
        });
        setCampos(ESTADO_INICIAL_CAMBIO_ESTADO);
        await cargarPendientes();
        return;
      }

      if (status === 400 || status === 404 || status === 409 || status === 422) {
        setFeedback({ tipo: "error", mensaje: data?.detalle ?? "No se pudo actualizar el turno." });
        return;
      }

      setFeedback({ tipo: "error", mensaje: "Error inesperado. Intenta de nuevo." });
    } catch {
      setFeedback({ tipo: "error", mensaje: "No se pudo conectar con el servidor." });
    } finally {
      setEnviando(false);
    }
  };

  return { campos, estados, coordinadores, pendientes, cargandoPendientes, enviando, feedback, handleChange, handleSubmit };
}
