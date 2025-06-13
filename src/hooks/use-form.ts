'use client';

import type React from 'react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

type ValidationRule<TValue> = {
  required?: string;
  pattern?: { value: RegExp; message: string };
  validate?: (value: TValue) => boolean | string;
};

export type FieldConfig<TData extends Record<string, any>> = {
  [K in keyof TData]?: ValidationRule<TData[K]> & {
    format?: (value: string) => string; // Assuming format input is always string
    defaultValue?: TData[K];
  };
};

type Errors<TData> = {
  [K in keyof TData]?: string;
};

export function useForm<TData extends Record<string, any>>(fieldConfig: FieldConfig<TData>) {
  const [values, setValues] = useState<TData>(() => {
    const initialValues: Partial<TData> = {};
    for (const key in fieldConfig) {
      initialValues[key as keyof TData] = fieldConfig[key]?.defaultValue ?? ('' as any);
    }
    return initialValues as TData;
  });
  const [errors, setErrors] = useState<Errors<TData>>({});

  const validateField = useCallback(
    (name: keyof TData, value: TData[keyof TData]) => {
      const config = fieldConfig[name];
      if (!config) return true;

      if (
        config.required &&
        (value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0))
      ) {
        return config.required;
      }

      // Ensure value is a string before testing pattern, unless it's not required and empty
      if (config.pattern && typeof value === 'string' && value !== '') {
        // For card numbers etc., often spaces are included for display but not for validation
        const valueToTest = name === 'cardNumber' ? value.replace(/\s/g, '') : value;
        if (!config.pattern.value.test(valueToTest)) {
          return config.pattern.message;
        }
      }

      if (config.validate) {
        const result = config.validate(value);
        if (typeof result === 'string') return result;
        if (result === false) return 'Invalid value.'; // Generic message if validator returns false
      }

      return true;
    },
    [fieldConfig],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const config = fieldConfig[name as keyof TData];

    let processedValue: any = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      processedValue = e.target.checked;
    } else if (config?.format) {
      processedValue = config.format(value);
    }

    setValues(prev => ({ ...prev, [name]: processedValue }));

    // Clear error for this field if it existed
    if (errors[name as keyof TData]) {
      const validationResult = validateField(name as keyof TData, processedValue as TData[keyof TData]);
      if (validationResult === true) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof TData];
          return newErrors;
        });
      } else {
        // Optionally, re-validate and show error immediately on change after first blur/submit
        // For now, just clears if valid.
      }
    }
  };

  const handleSubmit = (onSubmit: (data: TData) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Errors<TData> = {};
    let isValid = true;

    for (const key in fieldConfig) {
      const validationResult = validateField(key as keyof TData, values[key as keyof TData]);
      if (validationResult !== true) {
        newErrors[key as keyof TData] = validationResult as string;
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      onSubmit(values);
    } else {
      // Optionally, focus the first field with an error
      const firstErrorKey = Object.keys(newErrors)[0];
      if (firstErrorKey) {
        const field = document.getElementById(firstErrorKey) || document.getElementsByName(firstErrorKey)[0];
        field?.focus();
      }
    }
  };

  const register = (name: keyof TData, options?: Partial<FieldConfig<TData>[keyof TData]>) => {
    // Merge any runtime options with initial config for this field
    // This is not typical for react-hook-form's register, but adapting for this custom hook
    if (options) {
      fieldConfig[name] = { ...fieldConfig[name], ...options } as FieldConfig<TData>[keyof TData];
    }

    return {
      name: String(name),
      id: String(name), // Ensure id is also set for label association
      value: values[name] || '',
      onChange: handleChange,
      'aria-invalid': !!errors[name],
      'aria-describedby': errors[name] ? `${String(name)}-error` : undefined,
      className: cn(errors[name] && 'border-destructive'), // Apply error class
    };
  };

  const reset = useCallback(
    (newValues?: Partial<TData>) => {
      const resetValues: Partial<TData> = {};
      for (const key in fieldConfig) {
        resetValues[key as keyof TData] = newValues?.[key as keyof TData] ?? fieldConfig[key]?.defaultValue ?? ('' as any);
      }
      setValues(resetValues as TData);
      setErrors({});
    },
    [fieldConfig],
  );

  return { values, errors, register, handleSubmit, reset, setValues, setErrors };
}
