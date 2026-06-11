import { useState } from "react";
import { Nav } from "./shared/components/Nav";
import { estilosApp } from "./shared/styles/common.styles";
import { DisponibilidadPage } from "./features/disponibilidad/presentation/pages/DisponibilidadPage";
import { AsignarTurnoPage } from "./features/turnos/presentation/pages/AsignarTurnoPage";
import { CambiarEstadoTurnoPage } from "./features/turnos/presentation/pages/CambiarEstadoTurnoPage";

const PAGINAS = [
  { id: "disponibilidad", etiqueta: "Disponibilidad", Componente: DisponibilidadPage },
  { id: "asignar-turno", etiqueta: "Asignar turno", Componente: AsignarTurnoPage },
  { id: "cambiar-estado", etiqueta: "Cambiar estado", Componente: CambiarEstadoTurnoPage },
];

export default function App() {
  const [paginaActiva, setPaginaActiva] = useState(PAGINAS[0].id);
  const PaginaActiva = PAGINAS.find((pagina) => pagina.id === paginaActiva).Componente;

  return (
    <div style={estilosApp.layout}>
      <Nav paginas={PAGINAS} paginaActiva={paginaActiva} onCambiarPagina={setPaginaActiva} />
      <PaginaActiva />
    </div>
  );
}
