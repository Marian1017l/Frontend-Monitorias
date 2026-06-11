import { estilosNav } from "../styles/common.styles";

export function Nav({ paginas, paginaActiva, onCambiarPagina }) {
  return (
    <nav style={estilosNav.nav}>
      {paginas.map((pagina) => (
        <button
          key={pagina.id}
          type="button"
          onClick={() => onCambiarPagina(pagina.id)}
          style={pagina.id === paginaActiva ? estilosNav.botonActivo : estilosNav.boton}
        >
          {pagina.etiqueta}
        </button>
      ))}
    </nav>
  );
}
