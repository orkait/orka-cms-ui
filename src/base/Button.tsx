import React, { HTMLAttributes } from 'react';

interface ButtonProps {
    text?: string;
    onClick: () => void;
    className?: HTMLAttributes<HTMLButtonElement>['className'];
}


const defaultButtonProps: ButtonProps = {
    text: '',
    onClick: () => { },
    className: "",
}


const Button = ({
    text,
    onClick,
    className,
}: ButtonProps = defaultButtonProps) => {
    
    return (
        <button
            className={className || ''}
            onClick={() => {
                if (onClick) {
                    onClick();
                }
            }}
        >
            {text || ''}
        </button>
    );
};

Button.defaultProps = defaultButtonProps;


export default Button;
