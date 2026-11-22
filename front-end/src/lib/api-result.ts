// De gegenereerde functies geven een union terug: succes (200/201) of een
// gedocumenteerde fout (401, 404, ...). Onze mutators gooien bij elke foutstatus een
// ApiError, dus als de aanroep terugkomt is het altijd een succes. unwrap() geeft de
// data daarvan terug met het juiste type, zonder eigen type-casts in de pagina's.
export function unwrap<R extends { status: number; data: unknown }>(
    res: R,
): Extract<R, { status: 200 | 201 }>['data'] {
    return res.data as Extract<R, { status: 200 | 201 }>['data'];
}
