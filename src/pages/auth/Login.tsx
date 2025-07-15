import { useState } from "react";
import User from "../../api/auth";
import { useMutation } from "@tanstack/react-query";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import type { AuthFormInputs } from "../../types/auth.type";
import AuthForm from "../../components/auth/AuthForm.component";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const togglePassword = () => setShowPassword((prev) => !prev);


  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: AuthFormInputs) => User.login(data),
  });

  const onSubmit: SubmitHandler<AuthFormInputs> = (data) => {
    mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "Login successfully");
        localStorage.setItem("isLogin" , res.token)
        navigate("/user-management")
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
      togglePassword={togglePassword}
      mode={"login"}
    />
  );
};

export default Login;
