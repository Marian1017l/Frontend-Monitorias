import { estilos } from "../styles/formularioTurno.styles";

export function Campo({ label, children }) {
  return (
    <div style={estilos.campo}>
      <label style={estilos.label}>{label}</label>
      {children}
    </div>
  );
}
