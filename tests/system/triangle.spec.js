// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/src/'); // URL de tu app local
});

test.describe('Triángulo Interactivo', () => {

  test('debe dibujar triángulo válido y marcar inputs verdes', async ({ page }) => {
    const inputA = page.locator('#sideA');
    const inputB = page.locator('#sideB');
    const inputC = page.locator('#sideC');
    const monitor = page.locator('.monitor');

    // Ingresar lados válidos
    await inputA.fill('3');
    await inputB.fill('4');
    await inputC.fill('5');
    
    // Espera de 300ms para que la app procese y dibuje el triángulo
    await page.waitForTimeout(300);

    // Verificar que los inputs se marcaron en verde
    await expect(inputA).toHaveCSS('border-color', 'rgb(0, 128, 0)');
    await expect(inputB).toHaveCSS('border-color', 'rgb(0, 128, 0)');
    await expect(inputC).toHaveCSS('border-color', 'rgb(0, 128, 0)');

    // Verificar que se dibujó el triángulo (SVG dentro de monitor)
    await expect(monitor.locator('svg')).toBeVisible();
  });

  test('debe mostrar error para triángulo inválido y marcar inputs rojos', async ({ page }) => {
    const inputA = page.locator('#sideA');
    const inputB = page.locator('#sideB');
    const inputC = page.locator('#sideC');
    const monitor = page.locator('.monitor');

    // Ingresar lados inválidos
    await inputA.fill('1');
    await inputB.fill('2');
    await inputC.fill('10');

    // Espera de 300ms para que la app procese y dibuje el triángulo
    await page.waitForTimeout(300);

    // Inputs en rojo
    await expect(inputA).toHaveCSS('border-color', 'rgb(255, 0, 0)');
    await expect(inputB).toHaveCSS('border-color', 'rgb(255, 0, 0)');
    await expect(inputC).toHaveCSS('border-color', 'rgb(255, 0, 0)');

    // Triángulo no dibujado
    await expect(monitor.locator('svg')).toHaveCount(0);
  });

});
