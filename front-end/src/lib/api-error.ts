// Gedeeld door client én server: geen window/document gebruik in dit bestand.

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Eén plek die de foutmelding uit een willekeurige fout haalt. Vervangt de
// `if (err instanceof Error) ... else ...`-ladder die in elke pagina stond.
export function getErrorMessage(
  err: unknown,
  fallback = 'Er is iets misgegaan.',
): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

// Zet een mislukte response om in een ApiError. NestJS stuurt { message, statusCode };
// bij validatiefouten is `message` een lijst met meldingen.
export async function toApiError(res: Response): Promise<ApiError> {
  let message = `API-fout (${res.status}): ${res.statusText}`;

  try {
    const body = await res.json();
    if (Array.isArray(body?.message)) {
      message = body.message.join(' ');
    } else if (typeof body?.message === 'string') {
      message = body.message;
    }
  } catch {
    // geen JSON in de body: houd de standaardmelding
  }

  return new ApiError(message, res.status);
}

// NestJS stuurt een lege body (geen "null") als een controller null teruggeeft,
// bv. GET /profile zonder leesprofiel. res.json() zou daar op crashen.
export async function parseBody<T>(res: Response): Promise<T> {
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}
