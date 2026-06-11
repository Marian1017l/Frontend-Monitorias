import { FormularioCambioEstado } from "../components/FormularioCambioEstado";
import { estilosApp } from "../../../../shared/styles/common.styles";

export function CambiarEstadoTurnoPage() {
  return (
    <div style={estilosApp.main}>
      <FormularioCambioEstado />
    </div>
  );
}
