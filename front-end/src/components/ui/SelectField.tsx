import { SelectHTMLAttributes } from 'react';
import type { Optie } from '@/lib/opties';
import { inputClass, labelClass } from './field-styles';

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
    id: string;
    label: string;
    options: readonly Optie[];
    // Eerste (lege) optie, bv. "Alle" voor filters of "Maak een keuze" voor formulieren.
    emptyLabel?: string;
    // true: de lege optie is niet kiesbaar (verplichte velden).
    emptyDisabled?: boolean;
    wrapperClassName?: string;
};

// Werkt zowel gecontroleerd (value/onChange, client) als ongecontroleerd
// (name/defaultValue, bv. in een server component met een GET-formulier).
export function SelectField({
    id,
    label,
    options,
    emptyLabel,
    emptyDisabled = false,
    wrapperClassName = 'mb-4',
    className = '',
    ...props
}: SelectFieldProps) {
    return (
        <div className={wrapperClassName}>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <select id={id} className={`${inputClass} ${className}`} {...props}>
                {emptyLabel !== undefined && (
                    <option value="" disabled={emptyDisabled}>
                        {emptyLabel}
                    </option>
                )}
                {options.map((optie) => (
                    <option key={optie.value} value={optie.value}>
                        {optie.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
