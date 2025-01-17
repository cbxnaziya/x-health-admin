export const signInValidationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Invalid email format",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
    },
  };
  

  export const signUpValidationRules = {
    name: {
      required: "Username is required",
      minLength: {
        value: 3,
        message: "Username must be at least 3 characters",
      },
      maxLength: {
        value: 20,
        message: "Username cannot exceed 20 characters",
      },
    },
    email: {
      required: "Email is required",
      pattern: {
        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: "Invalid email format",
      },
    },
    phone: {
      required: "Phone number is required",
      pattern: {
        value: /^[0-9]{10}$/, // Example: Validates a 10-digit phone number
        message: "Invalid phone number format",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Password must be at least 6 characters",
      },
      maxLength: {
        value: 20,
        message: "Password cannot exceed 20 characters",
      },
    },
  };
  