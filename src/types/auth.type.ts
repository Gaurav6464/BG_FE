export type AuthFormInputs = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type VerifyOtpProps = {
resetTimerKey:boolean;
  onSubmit: any;
  isSubmitting?: boolean;
  isResending?:boolean;
  resendTimer: number;
  onResend: any;
  ctaLabel?: string;
  email: string;
  showNewPassword?: boolean;
};

export type AuthFormProps = {
  mode: AuthMode;
  onSubmit: any;
  isPending?: boolean;
  isSuccess?: boolean;
  showPassword?: boolean;
  togglePassword?: () => void;
  showConfirmPassword?: boolean;
  toggleConfirmPassword?: () => void;
};

export type AuthMode = "login" | "signup" | "forgot";
