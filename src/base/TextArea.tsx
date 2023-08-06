import React, { ChangeEvent, useEffect, useState } from 'react';

interface TextAreaProps {
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
    focused?: boolean;
}


const defaultTextAreaProps = {
    id: '',
    name: '',
    value: '',
    label: '',
    placeholder: '',
    rows: 3,
    cols: 20,
    disabled: false,
    onChange: () => { },
    onBlur: () => { },
    onFocus: () => { },
    showLabel: true,
    labelTop: '',
    labelRight: '',
    labelLeft: '',
    labelBottom: '',
    focused: false,
}


const TextArea = ({
    id,
    name,
    value,
    placeholder,
    rows,
    cols,
    disabled,
    onChange,
    onBlur,
    onFocus,
    labelTop,
    labelRight,
    labelLeft,
    labelBottom,
}: TextAreaProps = defaultTextAreaProps) => {
    const [text, setText] = useState(value);

    useEffect(() => {
        setText(value);
    }, [value])


    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
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
            <textarea
                className="textarea textarea-bordered"
                id={id}
                name={name}
                value={text}
                placeholder={placeholder}
                rows={rows}
                cols={cols}
                disabled={disabled}
                onChange={handleChange}
                onFocus={(e) => {
                    if (onFocus) onFocus(e);
                }}
                onBlur={(e) => {
                    if (onBlur) onBlur(e);
                }}
            ></textarea>
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

TextArea.defaultProps = defaultTextAreaProps;


export default TextArea;
