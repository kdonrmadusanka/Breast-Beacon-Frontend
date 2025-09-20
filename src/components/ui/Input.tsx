import React, { type ChangeEvent, forwardRef } from 'react';

type InputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  name: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  error?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      name,
      value,
      defaultValue,
      placeholder,
      label,
      disabled = false,
      required = false,
      readOnly = false,
      autoComplete,
      autoFocus = false,
      error,
      className = '',
      inputClassName = '',
      labelClassName = '',
      errorClassName = '',
      onChange,
      onBlur,
      onFocus,
      icon,
      iconPosition = 'left',
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className={`mb-1 text-sm font-medium text-gray-700 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            id={name}
            name={name}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            className={`${className} border-2 w-full px-3 py-2 border ${
              error ? 'border-red-500' : 'border-black'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              icon && iconPosition === 'left' ? 'pl-10' : ''
            } ${icon && iconPosition === 'right' ? 'pr-10' : ''} ${inputClassName}`}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;