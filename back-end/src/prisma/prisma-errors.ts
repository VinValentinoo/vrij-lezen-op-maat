import { Prisma } from '@prisma/client';

// P2002 = "Unique constraint failed". Alleen deze fout betekent echt dat het
// record al bestond; andere fouten (database down, FK-fout) moeten niet als
// "bestaat al" aan de gebruiker getoond worden.
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}
