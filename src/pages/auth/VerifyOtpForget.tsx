import { useMutation } from "@tanstack/react-query";
import OtpVerification from "../../components/auth/OtpVerification";
import { useLocation, useNavigate } from "react-router-dom";
import User from "../../api/auth";
import { toast } from "react-toastify";
import { useState } from "react";

const VerifyOtpForget: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();
  const [resetTimerKey, setResetTimerKey] = useState(false);

  // OTP Verification Mutation
  const { mutate: verifyOtp, isPending } = useMutation({
    mutationFn: (data: any) => User.verifyForgetPassword(data),
  });

  // OTP Resend Mutation
  const { mutate: resendOtp, isPending: isResending } = useMutation({
    mutationFn: (data: any) => User.resendForgetpasswordOtp(data),
  });

  const onSubmit = (data: any) => {
    verifyOtp(data, {
      onSuccess: (res) => {
        toast.success(
          res.message || "Password reset successfully successfully"
        );

        navigate("/login");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "OTP verification failed");
      },
    });
  };

  const onResend = () => {
    if (!email) return toast.error("Email not available");
    resendOtp(
      { email },
      {
        onSuccess: (res: any) => {
          toast.success(res.message || "OTP resent successfully");
          setResetTimerKey((prev) => !prev);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to resend OTP");
        },
      }
    );
  };

  return (
    <OtpVerification
      onSubmit={(code: any) => onSubmit(code)}
      isSubmitting={isPending}
      resendTimer={10}
      onResend={onResend}
      ctaLabel="Verify & Create new password"
      showNewPassword={true}
      email={email}
      isResending={isResending}
      resetTimerKey={resetTimerKey}
    />
  );
};

export default VerifyOtpForget;
