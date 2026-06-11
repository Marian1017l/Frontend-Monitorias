import { test, expect } from "@playwright/test";
import { mockDisponibilidad, DISPONIBILIDAD_LANS, DISPONIBILIDAD_CENTRAL } from "./mocks";

test.describe("Disponibilidad de salas", () => {
  test("muestra las salas de la sede por defecto con su estado", async ({ page }) => {
    await mockDisponibilidad(page);
    await page.goto("/");

    await expect(page.getByText("Disponibilidad de salas")).toBeVisible();

    for (const sala of DISPONIBILIDAD_LANS.salas) {
      await expect(page.getByText(sala.nombre, { exact: true })).toBeVisible();
    }

    await expect(page.getByText("Libre", { exact: true })).toBeVisible();
    await expect(page.getByText("En monitoria", { exact: true })).toBeVisible();
    await expect(page.getByText("Restringida", { exact: true })).toBeVisible();
  });

  test("cambia de sede y consulta la disponibilidad correspondiente", async ({ page }) => {
    await mockDisponibilidad(page);
    await page.goto("/");

    await page.getByLabel("Sede").selectOption("sede-central-001");

    for (const sala of DISPONIBILIDAD_CENTRAL.salas) {
      await expect(page.getByText(sala.nombre, { exact: true }).first()).toBeVisible();
    }
  });

  test("muestra error cuando la sede no existe", async ({ page }) => {
    await page.route("**/salas/*/disponibilidad", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "No encontrado", detalle: "Sede no encontrada" }),
      });
    });

    await page.goto("/");

    await expect(page.getByText("Sede no encontrada")).toBeVisible();
  });
});
