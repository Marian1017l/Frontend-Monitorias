import { useState } from "react";

const SALONES_MOCK = [
  { id: "sala-1", nombre: "Sala 1" },
  { id: "sala-2", nombre: "Sala 2" },
  { id: "mac",    nombre: "MAC" },
];

const MONITORES_MOCK = [
  { id: "monitor-1", nombre: "Carlos Perez" },
];

const ESTADO_INICIAL = {
  salonId: "",
  monitorId: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
};

export default function FormularioTurno() {
  const [campos, setCampos] = useState(ESTADO_INICIAL);
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
      const res = await fetch("http://localhost:3000/turnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salaId: campos.salonId,
          monitorId: campos.monitorId,
          fecha: campos.fecha,
          horaInicioPlan: campos.horaInicio,
          horaFinPlan: campos.horaFin,
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        const salon = salones.find((s) => s.id === campos.salonId);
        const monitor = monitores.find((m) => m.id === campos.monitorId);
        setFeedback({
          tipo: "exito",
          mensaje: `Turno asignado: ${salon?.nombre} — ${monitor?.nombre} — ${campos.fecha} de ${campos.horaInicio} a ${campos.horaFin}`,
        });
        setCampos(ESTADO_INICIAL);
        return;
      }

      if (res.status === 409) {
        setFeedback({ tipo: "error", mensaje: data.detalle ?? "Conflicto al asignar el turno." });
        return;
      }

      if (res.status === 400) {
        setFeedback({ tipo: "error", mensaje: data.error ?? "Datos invalidos." });
        return;
      }

      setFeedback({ tipo: "error", mensaje: "Error inesperado. Intenta de nuevo." });
    } catch {
      setFeedback({ tipo: "error", mensaje: "No se pudo conectar con el servidor." });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.tarjeta}>
        <div style={estilos.encabezado}>
          <div style={estilos.barraLateral} />
          <div>
            <p style={estilos.eyebrow}>Coordinador de sede</p>
            <h2 style={estilos.titulo}>Asignar turno de monitoria</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={estilos.form}>
          <Campo label="Salon">
            <select name="salonId" value={campos.salonId} onChange={handleChange} required style={estilos.control}>
              <option value="">Selecciona un salon</option>
              {salones.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Monitor">
            <select name="monitorId" value={campos.monitorId} onChange={handleChange} required style={estilos.control}>
              <option value="">Selecciona un monitor</option>
              {monitores.map((m) => (
                <option key={m.id} value={m.id}>{m.nombre}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Fecha">
            <input type="date" name="fecha" value={campos.fecha} onChange={handleChange} required style={estilos.control} />
          </Campo>

          <Campo label="Hora inicio">
            <input type="time" name="horaInicio" value={campos.horaInicio} onChange={handleChange} required style={estilos.control} />
          </Campo>

          <Campo label="Hora fin">
            <input type="time" name="horaFin" value={campos.horaFin} onChange={handleChange} required style={estilos.control} />
          </Campo>

          {feedback && (
            <div style={feedback.tipo === "exito" ? estilos.feedbackExito : estilos.feedbackError}>
              {feedback.mensaje}
            </div>
          )}

          <button type="submit" disabled={enviando} style={enviando ? estilos.botonDeshabilitado : estilos.boton}>
            {enviando ? "Asignando..." : "Asignar turno"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div style={estilos.campo}>
      <label style={estilos.label}>{label}</label>
      {children}
    </div>
  );
}

const estilos = {
  contenedor: {
    minHeight: "100vh",
    backgroundColor: "#F7F8FA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  tarjeta: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
    width: "100%",
    maxWidth: "480px",
    overflow: "hidden",
  },
  encabezado: {
    display: "flex",
    alignItems: "stretch",
    gap: "1.25rem",
    padding: "1.5rem 1.75rem",
    borderBottom: "1px solid #E5E7EB",
  },
  barraLateral: {
    width: "4px",
    borderRadius: "4px",
    backgroundColor: "#1E3A8A",
    flexShrink: 0,
  },
  eyebrow: {
    margin: 0,
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#6B7280",
  },
  titulo: {
    margin: "0.2rem 0 0",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#111827",
  },
  form: {
    padding: "1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  campo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
  },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#374151",
    letterSpacing: "0.01em",
  },
  control: {
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    backgroundColor: "#F9FAFB",
    color: "#111827",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  feedbackExito: {
    padding: "0.75rem 1rem",
    backgroundColor: "#F0FDF4",
    border: "1px solid #86EFAC",
    borderRadius: "6px",
    color: "#15803D",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  feedbackError: {
    padding: "0.75rem 1rem",
    backgroundColor: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "6px",
    color: "#DC2626",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
  boton: {
    marginTop: "0.25rem",
    padding: "0.65rem 1.25rem",
    backgroundColor: "#1E3A8A",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  botonDeshabilitado: {
    marginTop: "0.25rem",
    padding: "0.65rem 1.25rem",
    backgroundColor: "#9CA3AF",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "not-allowed",
  },
};
