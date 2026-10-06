import { test, expect } from '@playwright/test';

test('niet-ingelogde gebruiker krijgt een autorisatiefout op een beveiligde pagina', async ({ page }) => {
    await page.goto('/advies');

    // getByText i.p.v. getByRole('alert'): Next.js heeft zelf ook een
    // onzichtbaar element met role="alert" (voor screenreaders, bij
    // routewisselingen), dus zoeken op role alleen is hier dubbelzinnig.
    await expect(page.getByText('Unauthorized')).toBeVisible();
});