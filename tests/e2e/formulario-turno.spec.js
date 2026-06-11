import { test, expect } from "@playwright/test";

async function llenarFormulario(page) {
  await page.getByLabel("Salon").selectOption("sala-1");
  await page.getByLabel("Monitor").selectOption("monitor-1");
  await page.getByLabel("Fecha").fill("2025-06-11");
  await page.getByLabel("Hora inicio").fill("10:00");
  await page.getByLabel("Hora fin").fill("12:00");
}

test.describe("Formulario de asignacion de turno", () => {
  test("carga el formulario con todos los campos", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Asignar turno de monitoria")).toBeVisible();
    await expect(page.getByLabel("Salon")).toBeVisible();
    await expect(page.getByLabel("Monitor")).toBeVisible();
    await expect(page.getByLabel("Fecha")).toBeVisible();
    await expect(page.getByLabel("Hora inicio")).toBeVisible();
    await expect(page.getByLabel("Hora fin")).toBeVisible();
    await expect(page.getByRole("button", { name: "Asignar turno" })).toBeVisible();
  });

  test("muestra mensaje de exito cuando la API responde 201", async ({ page }) => {
    await page.route("**/turnos", async (route) => {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({}),
      });
    });

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText(/Turno asignado: Sala 1/)).toBeVisible();
  });

  test("muestra mensaje de conflicto cuando la API responde 409", async ({ page }) => {
    await page.route("**/turnos", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ detalle: "El salon ya tiene un turno asignado en ese horario." }),
      });
    });

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText("El salon ya tiene un turno asignado en ese horario.")).toBeVisible();
  });

  test("muestra mensaje de datos invalidos cuando la API responde 400", async ({ page }) => {
    await page.route("**/turnos", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "El horario de fin debe ser posterior al de inicio." }),
      });
    });

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText("El horario de fin debe ser posterior al de inicio.")).toBeVisible();
  });

  test("muestra error cuando no hay conexion con el servidor", async ({ page }) => {
    await page.route("**/turnos", (route) => route.abort());

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText("No se pudo conectar con el servidor.")).toBeVisible();
  });
});
