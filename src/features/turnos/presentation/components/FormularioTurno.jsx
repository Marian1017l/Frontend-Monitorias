import { useAsignarTurno } from "../../application/useAsignarTurno";
import { Campo } from "./Campo";
import { FeedbackMessage } from "./FeedbackMessage";
import { estilos } from "../styles/formularioTurno.styles";

export function FormularioTurno() {
  const { campos, salones, monitores, enviando, feedback, handleChange, handleSubmit } = useAsignarTurno();

  return (
    <div style={estilos.tarjeta}>
      <div style={estilos.encabezado}>
        <div style={estilos.barraLateral} />
        <div>
          <p style={estilos.eyebrow}>Coordinador de sede</p>
          <h2 style={estilos.titulo}>Asignar turno de monitoria</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={estilos.form}>
        <Campo label="Salon" htmlFor="salonId">
          <select id="salonId" name="salonId" value={campos.salonId} onChange={handleChange} required style={estilos.control}>
            <option value="">Selecciona un salon</option>
            {salones.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Monitor" htmlFor="monitorId">
          <select id="monitorId" name="monitorId" value={campos.monitorId} onChange={handleChange} required style={estilos.control}>
            <option value="">Selecciona un monitor</option>
            {monitores.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Fecha" htmlFor="fecha">
          <input id="fecha" type="date" name="fecha" value={campos.fecha} onChange={handleChange} required style={estilos.control} />
        </Campo>

        <Campo label="Hora inicio" htmlFor="horaInicio">
          <input id="horaInicio" type="time" name="horaInicio" value={campos.horaInicio} onChange={handleChange} required style={estilos.control} />
        </Campo>

        <Campo label="Hora fin" htmlFor="horaFin">
          <input id="horaFin" type="time" name="horaFin" value={campos.horaFin} onChange={handleChange} required style={estilos.control} />
        </Campo>

        <FeedbackMessage feedback={feedback} />

        <button type="submit" disabled={enviando} style={enviando ? estilos.botonDeshabilitado : estilos.boton}>
          {enviando ? "Asignando..." : "Asignar turno"}
        </button>
      </form>
    </div>
  );
}
