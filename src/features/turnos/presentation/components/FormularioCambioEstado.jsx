import { useActualizarEstadoTurno } from "../../application/useActualizarEstadoTurno";
import { formatearTurnoPendiente } from "../../domain/entities/turno";
import { Campo } from "../../../../shared/components/Campo";
import { FeedbackMessage } from "../../../../shared/components/FeedbackMessage";
import { estilosTarjeta } from "../../../../shared/styles/common.styles";

export function FormularioCambioEstado() {
  const { campos, estados, coordinadores, pendientes, cargandoPendientes, enviando, feedback, handleChange, handleSubmit } = useActualizarEstadoTurno();

  return (
    <div style={estilosTarjeta.tarjeta}>
      <div style={estilosTarjeta.encabezado}>
        <div style={estilosTarjeta.barraLateral} />
        <div>
          <p style={estilosTarjeta.eyebrow}>Coordinador de sede</p>
          <h2 style={estilosTarjeta.titulo}>Cambiar estado de turno</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={estilosTarjeta.form}>
        <Campo label="Turno pendiente de aprobacion" htmlFor="turnoId">
          <select id="turnoId" name="turnoId" value={campos.turnoId} onChange={handleChange} required style={estilosTarjeta.control}>
            <option value="">
              {cargandoPendientes ? "Cargando turnos pendientes..." : "Selecciona un turno"}
            </option>
            {pendientes.map((turno) => (
              <option key={turno.id} value={turno.id}>{formatearTurnoPendiente(turno)}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Nuevo estado" htmlFor="estado">
          <select id="estado" name="estado" value={campos.estado} onChange={handleChange} required style={estilosTarjeta.control}>
            <option value="">Selecciona un estado</option>
            {estados.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Coordinador (opcional)" htmlFor="coordinadorId">
          <select id="coordinadorId" name="coordinadorId" value={campos.coordinadorId} onChange={handleChange} style={estilosTarjeta.control}>
            <option value="">Sin especificar</option>
            {coordinadores.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </Campo>

        <FeedbackMessage feedback={feedback} />

        <button type="submit" disabled={enviando} style={enviando ? estilosTarjeta.botonDeshabilitado : estilosTarjeta.boton}>
          {enviando ? "Actualizando..." : "Cambiar estado"}
        </button>
      </form>
    </div>
  );
}
