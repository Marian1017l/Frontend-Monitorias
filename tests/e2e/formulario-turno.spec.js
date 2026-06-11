import { test, expect } from "@playwright/test";

async function llenarFormulario(page) {
  await page.getByLabel("Salon").selectOption("sala-lans-001");
  await page.getByLabel("Monitor").selectOption("monitor-001");
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
        body: JSON.stringify({
          id: "b3ed5769-1484-4f67-b936-d409c7752416",
          estado: "pendiente_aprobacion",
          horasPlanificadas: 2,
        }),
      });
    });

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText(/Turno asignado: Sala 1/)).toBeVisible();
    await expect(page.getByText(/pendiente_aprobacion/)).toBeVisible();
  });

  test("muestra mensaje de conflicto (TURNO_SOLAPADO) cuando la API responde 409", async ({ page }) => {
    await page.route("**/turnos", async (route) => {
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ error: "TURNO_SOLAPADO", detalle: "El monitor ya tiene un turno en esa fecha y franja." }),
      });
    });

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText("El monitor ya tiene un turno en esa fecha y franja.")).toBeVisible();
  });

  test("muestra mensaje de datos invalidos cuando la API responde 400", async ({ page }) => {
    await page.route("**/turnos", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "Solicitud invalida", detalle: "Horario fuera del rango de la sede." }),
      });
    });

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText("Horario fuera del rango de la sede.")).toBeVisible();
  });

  test("muestra mensaje de no encontrado cuando la API responde 404", async ({ page }) => {
    await page.route("**/turnos", async (route) => {
      await route.fulfill({
        status: 404,
        contentType: "application/json",
        body: JSON.stringify({ error: "No encontrado", detalle: "Monitor, sala o sede no encontrada" }),
      });
    });

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText("Monitor, sala o sede no encontrada")).toBeVisible();
  });

  test("muestra error cuando no hay conexion con el servidor", async ({ page }) => {
    await page.route("**/turnos", (route) => route.abort());

    await page.goto("/");
    await llenarFormulario(page);
    await page.getByRole("button", { name: "Asignar turno" }).click();

    await expect(page.getByText("No se pudo conectar con el servidor.")).toBeVisible();
  });
});
