import { useState } from "react";
import User from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import AuthForm from "../../components/auth/AuthForm.component";
import type { AuthFormInputs } from "../../types/auth.type";
import { useNavigate } from "react-router-dom";

const ForgetPassword: React.FC = () => {
 const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate()

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: AuthFormInputs) => User.resendForgetpasswordOtp(data),
  });

  const onSubmit: SubmitHandler<AuthFormInputs> = (data) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Registered successfully");
             navigate("/verify-forget-password", { state: { email: data.email } });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Error occurred");
      },
    });
  };

  return (
    <AuthForm
      onSubmit={onSubmit}
      isPending={isPending}
      isSuccess={isSuccess}
      showPassword={showPassword}
      showConfirmPassword={showConfirmPassword}
      togglePassword={togglePassword}
      toggleConfirmPassword={toggleConfirmPassword} mode={"forgot"}    />
  );
};

export default ForgetPassword;
