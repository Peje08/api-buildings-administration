import { useState } from 'react';
import { strings } from '../constants/strings';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  password: string;
}

export const useFormHandler = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validaciones
    if (name === 'email') {
      const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ''
        : strings.validateMail;
      setErrors((prev) => ({ ...prev, email: emailError }));
    }

    if (name === 'confirmPassword') {
      const passwordError = value !== formData.password ? strings.notMatchingPasswords : '';
      setErrors((prev) => ({ ...prev, password: passwordError }));
    }
  };

  return { formData, errors, handleChange };
};
