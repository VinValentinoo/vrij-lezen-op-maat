import { test, expect } from '@playwright/test';
import { registreerEnVulProfielIn } from './helpers';

// Route guards: src/middleware.ts stuurt bezoekers zonder (geldig) token door naar
// /login en bezoekers met de verkeerde rol naar de homepage, nog vóór de pagina rendert.

test('niet-ingelogde bezoeker wordt bij directe URL-invoer doorgestuurd naar /login', async ({ page }) => {
    await page.goto('/advies');

    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Inloggen' })).toBeVisible();
});

test('niet-ingelogde bezoeker kan ook de docentpagina niet openen', async ({ page }) => {
    await page.goto('/docent');

    await expect(page).toHaveURL('/login');
});

test('ingelogde student wordt van de docentpagina teruggestuurd naar home', async ({ page }) => {
    await registreerEnVulProfielIn(page);

    await page.goto('/docent');

    await expect(page).toHaveURL('/');
});

test('een niet-bestaande route toont de 404-pagina', async ({ page }) => {
    await page.goto('/bestaat-niet');

    await expect(page.getByRole('heading', { name: 'Pagina niet gevonden' })).toBeVisible();
});
