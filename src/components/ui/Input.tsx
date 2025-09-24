import React, { type ChangeEvent, forwardRef } from 'react';

type InputProps = {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date';
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
  min?: string; // Added for date type
  max?: string; // Added for date type
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
      min, // New prop for minimum date
      max, // New prop for maximum date
    },
    ref
  ) => {
    // Format value for date input (YYYY-MM-DD format required by HTML5 date input)
    const formatDateValue = (val: string | number | undefined): string | number | undefined => {
      if (type === 'date' && val) {
        // If it's a date type and has value, ensure it's in YYYY-MM-DD format
        if (typeof val === 'string') {
          // Try to parse and format the date string
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        } else if (typeof val === 'number') {
          // Handle timestamp
          const date = new Date(val);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
        }
      }
      return val;
    };

    const formattedValue = formatDateValue(value);
    const formattedDefaultValue = formatDateValue(defaultValue);

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
            value={formattedValue}
            defaultValue={formattedDefaultValue}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            min={min} // For date type: minimum allowed date (YYYY-MM-DD)
            max={max} // For date type: maximum allowed date (YYYY-MM-DD)
            className={`
              w-full px-3 py-2 border-2 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              ${error ? 'border-red-500' : 'border-black'}
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${type === 'date' ? 'pr-3' : ''} // Extra padding for date picker icon
              ${inputClassName}
            `}
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