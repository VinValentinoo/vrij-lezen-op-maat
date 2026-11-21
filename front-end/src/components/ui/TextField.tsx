import { InputHTMLAttributes } from 'react';
import { inputClass, labelClass } from './field-styles';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    id: string;
    label: string;
    wrapperClassName?: string;
};

// Label + input in één component: de label is altijd via htmlFor/id gekoppeld
// (nodig voor schermlezers en voor e2e-tests met getByLabel).
export function TextField({
    id,
    label,
    wrapperClassName = 'mb-4',
    className = '',
    ...props
}: TextFieldProps) {
    return (
        <div className={wrapperClassName}>
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <input id={id} className={`${inputClass} ${className}`} {...props} />
        </div>
    );
}
