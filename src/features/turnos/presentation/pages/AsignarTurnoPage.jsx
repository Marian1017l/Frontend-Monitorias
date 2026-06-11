import { FormularioTurno } from "../components/FormularioTurno";
import { estilosApp } from "../../../../shared/styles/common.styles";

export function AsignarTurnoPage() {
  return (
    <div style={estilosApp.main}>
      <FormularioTurno />
    </div>
  );
}
