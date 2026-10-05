import { test, expect } from '@playwright/test';
import { registreerEnVulProfielIn } from './helpers';

test('student voegt boek toe aan leeslijst en wisselt de gelezen-status', async ({ page }) => {
    await registreerEnVulProfielIn(page);

    await page.goto('/advies');

    // .first() pakt de knop van de eerste advieskaart. We weten niet
    // welk boek dat precies is (dat hangt af van de matching-score),
    // en dat maakt voor deze test ook niet uit.
    const eersteToevoegenKnop = page.getByRole('button', { name: 'Toevoegen aan leeslijst' }).first();
    await eersteToevoegenKnop.click();

    // AddToLeeslijstButton toont na succes "✓ Toegevoegd" en wordt
    // disabled — dat controleren we allebei.
    const toegevoegdKnop = page.getByRole('button', { name: '✓ Toegevoegd' }).first();
    await expect(toegevoegdKnop).toBeVisible();
    await expect(toegevoegdKnop).toBeDisabled();

    // --- naar de leeslijst-pagina ---
    await page.goto('/leeslijst');

    // Het zojuist toegevoegde boek moet hier staan met status
    // "Nog niet gelezen" (de initiële status NIET_GELEZEN).
    await expect(page.getByText('Nog niet gelezen').first()).toBeVisible();

    // Klik de knop die van status wisselt.
    await page.getByRole('button', { name: 'Markeer als gelezen' }).first().click();

    // Na de PATCH-call moet de kaart nu "Gelezen" tonen, en de knoptekst
    // moet zijn omgedraaid naar "Markeer als niet gelezen".
    await expect(page.getByText('Gelezen', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Markeer als niet gelezen' }).first()).toBeVisible();
});