import { Page, expect } from '@playwright/test';

export async function registreerEnVulProfielIn(page: Page) {
    // Date.now() + een random getal: zonder dit zou de tweede testrun
    // falen op "e-mailadres bestaat al" (ConflictException in je backend).
    const email = `student-${Date.now()}-${Math.floor(Math.random() * 100000)}@test.nl`;
    const wachtwoord = 'Test1234!';

    // --- registreren ---
    await page.goto('/register');
    await page.getByLabel('Naam').fill('Test Student');
    // Ook een <select> wordt gevonden via getByLabel, zolang het label
    // een htmlFor heeft dat naar het select-id wijst (bij jou klopt dat).
    await page.getByLabel('Rol').selectOption({ label: 'Student' });
    await page.getByLabel('E-mailadres').fill(email);
    await page.getByLabel('Wachtwoord').fill(wachtwoord);
    await page.getByRole('button', { name: 'Registreren' }).click();

    // Jouw RegisterPage doet na succes router.push('/login') — geen
    // zichtbare bevestiging, dus de URL-wissel ZELF is hier het bewijs
    // dat de registratie geslaagd is.
    await expect(page).toHaveURL('/login');

    // --- inloggen ---
    await page.getByLabel('E-mailadres').fill(email);
    await page.getByLabel('Wachtwoord').fill(wachtwoord);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    // Jouw LoginPage stuurt na succes door naar /profiel.
    await expect(page).toHaveURL('/profiel');

    // --- leesprofiel invullen ---
    // Let op: dit is dezelfde pagina als hierboven, /profiel, niet een
    // aparte /leesprofiel-route.
    await page.getByLabel('Taalniveau').selectOption({ label: '3F' });
    await page.getByLabel('Genre').selectOption({ label: 'Boek - roman' });
    await page.getByLabel('Onderwerp').selectOption({ label: 'Reizen' });
    await page.getByLabel('Lengte').selectOption({ label: 'Middel' });
    await page.getByLabel('Leesdoel').fill('Ontspanning');
    await page.getByRole('button', { name: 'Aanmaken' }).click();

    // Er is geen aparte succesmelding, maar ProfielPage wisselt de
    // knoptekst van "Aanmaken" naar "Bewerken" zodra profileExists true
    // wordt — dat is onze bevestiging dat het opslaan is gelukt.
    await expect(page.getByRole('button', { name: 'Bewerken' })).toBeVisible();
}