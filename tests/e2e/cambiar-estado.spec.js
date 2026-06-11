import { test, expect } from "@playwright/test";
import { mockDisponibilidad, mockTurnosPendientes } from "./mocks";

async function irACambiarEstado(page) {
  await mockDisponibilidad(page);
  await mockTurnosPendientes(page);
  await page.goto("/");
  await page.getByRole("navigation").getByRole("button", { name: "Cambiar estado" }).click();
}

function botonCambiarEstado(page) {
  return page.locator("form").getByRole("button", { name: "Cambiar estado" });
}

test.describe("Cambiar estado de turno", () => {
  test("carga el formulario con todos los campos y los turnos pendientes", async ({ page }) => {
    await irACambiarEstado(page);

    await expect(page.getByText("Cambiar estado de turno")).toBeVisible();
    await expect(page.getByLabel("Turno pendiente de aprobacion")).toBeVisible();
    await expect(page.getByLabel("Nuevo estado")).toBeVisible();
    await expect(page.getByLabel("Coordinador (opcional)")).toBeVisible();
    await expect(botonCambiarEstado(page)).toBeVisible();

    await expect(page.getByRole("option", { name: /Sala 1 \(LANS\) — Mariana López/ })).toBeAttached();
  });

  test("actualiza el estado correctamente cuando la API responde 200", async ({ page }) => {
    await page.route("**/turnos/*/estado", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          id: "turno-seed-001",
          estadoAnterior: "pendiente_aprobacion",
          estadoNuevo: "aprobado",
          updatedAt: "2026-06-11T17:17:19.118Z",
        }),
      });
    });

    await irACambiarEstado(page);
    await page.getByLabel("Turno pendiente de aprobacion").selectOption("turno-seed-001");
    await page.getByLabel("Nuevo estado").selectOption("aprobado");
    await page.getByLabel("Coordinador (opcional)").selectOption("coordinador-001");
    await botonCambiarEstado(page).click();

    await expect(page.getByText("Turno turno-seed-001: pendiente_aprobacion → aprobado")).toBeVisible();
  });

  test("muestra error de transicion invalida cuando la API responde 422", async ({ page }) => {
    await page.route("**/turnos/*/estado", async (route) => {
      await route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({ error: "Entidad no procesable", detalle: "Transicion invalida: finalizado → aprobado" }),
      });
    });

    await irACambiarEstado(page);
    await page.getByLabel("Turno pendiente de aprobacion").selectOption("turno-seed-001");
    await page.getByLabel("Nuevo estado").selectOption("aprobado");
    await botonCambiarEstado(page).click();

    await expect(page.getByText("Transicion invalida: finalizado → aprobado")).toBeVisible();
  });
});
