import { test, expect } from '@playwright/test';
import { registreerEnVulProfielIn } from './helpers';

test('student registreert, vult leesprofiel in en ontvangt advies', async ({ page }) => {
    await registreerEnVulProfielIn(page);

    await page.goto('/advies');

    // AdviesPage rendert geen apart element per suggestie met een
    // unieke testid, maar wel een "Toevoegen aan leeslijst"-knop per
    // kaart (via AddToLeeslijstButton). Die knop is dus een betrouwbare,
    // zichtbare manier om te tellen hoeveel suggesties er zijn, zonder
    // dat we JSX hoeven aan te passen.
    const toevoegenKnoppen = page.getByRole('button', { name: 'Toevoegen aan leeslijst' });

    // toBeVisible() wacht vanzelf tot de GET /advies-call klaar is
    // (tot de 30s-timeout) — geen handmatige sleep() nodig.
    await expect(toevoegenKnoppen.first()).toBeVisible();

    // AdviesService retourneert top3, dus we verwachten 1 t/m 3 kaarten.
    const aantal = await toevoegenKnoppen.count();
    expect(aantal).toBeGreaterThan(0);
    expect(aantal).toBeLessThanOrEqual(3);
});