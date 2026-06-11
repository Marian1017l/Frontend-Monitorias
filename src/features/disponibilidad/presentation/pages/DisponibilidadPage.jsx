import { useDisponibilidad } from "../../application/useDisponibilidad";
import { SalaCard } from "../components/SalaCard";
import { estilosApp, estilosTarjeta } from "../../../../shared/styles/common.styles";
import { estilosDisponibilidad } from "../styles/disponibilidad.styles";

export function DisponibilidadPage() {
  const { sedes, sedeId, setSedeId, salas, consultadaEn, cargando, error } = useDisponibilidad();

  return (
    <div style={estilosApp.main}>
      <div style={estilosDisponibilidad.contenedor}>
        <div style={estilosDisponibilidad.encabezado}>
          <div style={estilosTarjeta.barraLateral} />
          <div style={{ flex: 1 }}>
            <p style={estilosTarjeta.eyebrow}>Coordinador de sede</p>
            <h2 style={estilosTarjeta.titulo}>Disponibilidad de salas</h2>
          </div>
          <select
            aria-label="Sede"
            value={sedeId}
            onChange={(e) => setSedeId(e.target.value)}
            style={{ ...estilosTarjeta.control, maxWidth: "180px" }}
          >
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>{sede.nombre}</option>
            ))}
          </select>
        </div>

        <div style={estilosDisponibilidad.cuerpo}>
          {consultadaEn && (
            <p style={estilosDisponibilidad.consultadaEn}>
              Consultado: {new Date(consultadaEn).toLocaleString()}
            </p>
          )}

          {cargando && <p>Cargando disponibilidad...</p>}

          {error && (
            <div style={estilosTarjeta.feedbackError}>{error}</div>
          )}

          {!cargando && !error && (
            <div style={estilosDisponibilidad.grid}>
              {salas.map((sala) => (
                <SalaCard key={sala.id} sala={sala} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
