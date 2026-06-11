import { estilos } from "../styles/formularioTurno.styles";

export function Campo({ label, htmlFor, children }) {
  return (
    <div style={estilos.campo}>
      <label style={estilos.label} htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
