// Gedeelde stijlen voor alle formuliervelden (stonden eerst in 5 bestanden).
//
// De rand is border-muted (#6B7280, ~4,8:1 op wit): WCAG 1.4.11 (non-text
// contrast) vraagt minstens 3:1 voor de rand van een invoerveld. De vorige
// border-brand-soft was bijna onzichtbaar (~1,2:1).
export const inputClass =
    'w-full rounded-md border border-muted bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand';

export const labelClass = 'mb-1 block text-sm font-medium text-ink';
