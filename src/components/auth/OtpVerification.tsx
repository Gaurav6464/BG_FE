import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { VerifyOtpProps } from "../../types/auth.type";

const OtpVerification: React.FC<VerifyOtpProps> = ({
  onSubmit,
  isSubmitting = false,
  isResending = false,
  resendTimer,
  onResend,
  ctaLabel = "Continue",
  showNewPassword = false,
  email,
  resetTimerKey,
}) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(resendTimer);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ newPassword: string }>();

  const newPassword = watch("newPassword");

  useEffect(() => {
    setSeconds(resendTimer);
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer, resetTimerKey]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...code];
    updated[index] = value;
    setCode(updated);

    // Auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setCode(digits);
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  const fullCode = code.join("");

  const isDisabled =
    isSubmitting || fullCode.length < 6 || (showNewPassword && !newPassword);

  const onFormSubmit = (data: { newPassword: string }) => {
    if (showNewPassword) {
      onSubmit({ otp: fullCode, newPassword: data.newPassword, email });
    } else {
      onSubmit({ otp: fullCode, email });
    }
  };

  const onBack = () => {
    navigate(showNewPassword ? "/login" : "/signup");
  };

  const handleResend = async () => {
    onResend();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg border border-gray-200 text-center">
        <div className="w-14 h-14 mx-auto bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          BG
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mt-4">
          {showNewPassword ? "Reset Password" : "Verify Email"}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {showNewPassword
            ? `Enter the 6-digit code sent to ${email} and choose a new password.`
            : `We've sent a 6-digit code to ${email}`}
        </p>

        <div className="flex justify-center space-x-2 mt-6">
          {code.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onPaste={handlePaste}
              maxLength={1}
              className="w-10 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4">
          {showNewPassword && (
            <div className="mt-4 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter New Password
              </label>
              <input
                type="password"
                {...register("newPassword", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                    message:
                      "Must include uppercase, lowercase, number & special character",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="New password"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4">
            {seconds > 0 ? (
              <>Resend code in {seconds}s</>
            ) : (
              <button
                onClick={handleResend}
                type="button"
                className="text-indigo-600 hover:underline disabled:opacity-50"
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend code"}
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className={`mt-6 w-full py-2.5 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-all ${
              isDisabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Verifying..." : ctaLabel}
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1"
        >
          <ArrowLeft size={16} />
          {showNewPassword ? "Back to signup" : "Back to login"}
        </button>

        <p className="text-xs text-gray-500 mt-2">
          {showNewPassword
            ? "Remembered your password?"
            : "Already have an account?"}{" "}
          <span
            onClick={onBack}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
