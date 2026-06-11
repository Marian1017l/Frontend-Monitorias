import { estilosTarjeta } from "../styles/common.styles";

export function FeedbackMessage({ feedback }) {
  if (!feedback) return null;

  return (
    <div style={feedback.tipo === "exito" ? estilosTarjeta.feedbackExito : estilosTarjeta.feedbackError}>
      {feedback.mensaje}
    </div>
  );
}
