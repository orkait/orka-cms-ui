import React, { ChangeEvent, HTMLAttributes, HTMLProps, useEffect, useState } from 'react';

interface InputProps {
    id?: string;
    name?: string;
    value: string;
    label?: string;
    placeholder?: string;
    rows?: number;
    cols?: number;
    disabled?: boolean;
    onChange: (value: string) => void;
    onBlur?: (e: any) => void;
    onFocus?: (e: any) => void;
    showLabel?: boolean;
    labelTop?: React.ReactNode;
    labelRight?: React.ReactNode;
    labelLeft?: React.ReactNode;
    labelBottom?: React.ReactNode;
    className?: HTMLAttributes<HTMLInputElement>['className'];
    focused?: boolean;
}


const defaultInputProps: InputProps = {
    id: '',
    name: '',
    value: '',
    label: '',
    placeholder: '',
    disabled: false,
    onChange: () => { },
    onBlur: () => { },
    onFocus: () => { },
    showLabel: true,
    labelTop: '',
    labelRight: '',
    labelLeft: '',
    labelBottom: '',
    className: "",
    focused: false,
}


const Input = ({
    id,
    name,
    value,
    placeholder,
    disabled,
    onChange,
    onBlur,
    onFocus,
    labelTop,
    labelRight,
    labelLeft,
    labelBottom,
    className,
}: InputProps = defaultInputProps) => {
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value);
    }, [value])

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;

        setText(newValue);
        onChange(newValue);
    };

    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text">
                    {labelTop || ''}
                </span>
                <span className="label-text-alt">
                    {labelRight || ''}
                </span>
            </label>
            <input
                className={`input input-bordered ${className || ''}`}
                id={id}
                name={name}
                value={text}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => {
                    handleChange(e)
                }}
                onFocus={(e) => {
                    if (onFocus) onFocus(e);
                }}
                onBlur={(e) => {
                    if (onBlur) onBlur(e);
                }}
            ></input>
            <label className="label">
                <span className="label-text-alt">
                    {labelBottom || ''}
                </span>
                <span className="label-text-alt">
                    {labelLeft || ''}
                </span>
            </label>
        </div>

    );
};

Input.defaultProps = defaultInputProps;


export default Input;
