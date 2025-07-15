import AuthForm from "../../components/auth/AuthForm.component";
import type { SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import type { AuthFormInputs } from "../../types/auth.type";
import User from "../../api/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: AuthFormInputs) => User.register(data),
  });

  const onSubmit: SubmitHandler<AuthFormInputs> = (data) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Registered successfully");
        navigate("/verify-otp-signup", { state: { email: data.email } });
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
      toggleConfirmPassword={toggleConfirmPassword}
      mode={"signup"}
    />
  );
};

export default Signup;
