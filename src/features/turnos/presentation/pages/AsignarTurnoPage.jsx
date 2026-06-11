import { FormularioTurno } from "../components/FormularioTurno";
import { estilos } from "../styles/formularioTurno.styles";

export function AsignarTurnoPage() {
  return (
    <div style={estilos.contenedor}>
      <FormularioTurno />
    </div>
  );
}
