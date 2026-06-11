import { ESTADOS_SALA } from "../../domain/entities/sala";
import { estilosDisponibilidad } from "../styles/disponibilidad.styles";

export function SalaCard({ sala }) {
  const estado = ESTADOS_SALA[sala.estado] ?? {
    etiqueta: sala.estado,
    color: "#374151",
    fondo: "#F9FAFB",
    borde: "#E5E7EB",
  };

  return (
    <div style={estilosDisponibilidad.tarjetaSala}>
      <p style={estilosDisponibilidad.nombreSala}>{sala.nombre}</p>
      <span
        style={{
          ...estilosDisponibilidad.badge,
          color: estado.color,
          backgroundColor: estado.fondo,
          borderColor: estado.borde,
        }}
      >
        {estado.etiqueta}
      </span>
    </div>
  );
}
