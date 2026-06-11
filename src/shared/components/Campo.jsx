import { estilosTarjeta } from "../styles/common.styles";

export function Campo({ label, htmlFor, children }) {
  return (
    <div style={estilosTarjeta.campo}>
      <label style={estilosTarjeta.label} htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
