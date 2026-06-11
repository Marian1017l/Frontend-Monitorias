import { useEffect, useState } from "react";
import { SEDES } from "../domain/entities/sala";
import { disponibilidadApiRepository } from "../infrastructure/api/disponibilidadApiRepository";

export function useDisponibilidad(repository = disponibilidadApiRepository) {
  const [sedeId, setSedeId] = useState(SEDES[0].id);
  const [salas, setSalas] = useState([]);
  const [consultadaEn, setConsultadaEn] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setCargando(true);
      setError(null);

      try {
        const { status, data } = await repository.obtenerPorSede(sedeId);
        if (cancelado) return;

        if (status === 200) {
          setSalas(data?.salas ?? []);
          setConsultadaEn(data?.consultadaEn ?? null);
          return;
        }

        setSalas([]);
        setConsultadaEn(null);
        setError(data?.detalle ?? "No se pudo obtener la disponibilidad.");
      } catch {
        if (!cancelado) {
          setSalas([]);
          setConsultadaEn(null);
          setError("No se pudo conectar con el servidor.");
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [sedeId, repository]);

  return { sedes: SEDES, sedeId, setSedeId, salas, consultadaEn, cargando, error };
}
