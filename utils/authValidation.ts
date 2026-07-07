export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  fullName: string;
  address: string;
  phone: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function validateLogin(values: LoginFormValues) {
  const errors: FormErrors<LoginFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}

export function validateRegistration(values: RegisterFormValues) {
  const errors: FormErrors<RegisterFormValues> = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required by the assignment.';
  }

  if (!values.username.trim()) {
    errors.username = 'Username is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required for Firebase Authentication.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 8) {
    errors.password = 'Password must contain at least 8 characters.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export function validateForgotPassword(values: ForgotPasswordFormValues) {
  const errors: FormErrors<ForgotPasswordFormValues> = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Enter a valid email address.';
  }

  return errors;
}

export function hasErrors<T extends object>(errors: FormErrors<T>) {
  return Object.values(errors).some(Boolean);
}
