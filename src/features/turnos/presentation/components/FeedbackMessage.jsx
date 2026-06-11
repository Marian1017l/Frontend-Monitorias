import { estilos } from "../styles/formularioTurno.styles";

export function FeedbackMessage({ feedback }) {
  if (!feedback) return null;

  return (
    <div style={feedback.tipo === "exito" ? estilos.feedbackExito : estilos.feedbackError}>
      {feedback.mensaje}
    </div>
  );
}
