import { useForm } from "react-hook-form";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import type {
  AuthFormInputs,
  AuthFormProps,
  AuthMode,
} from "../../types/auth.type";

const AuthForm: React.FC<AuthFormProps> = ({
  mode = "signup",
  onSubmit,
  isPending,
  isSuccess,
  showPassword,
  togglePassword,
  showConfirmPassword,
  toggleConfirmPassword,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AuthFormInputs>();

  const password = watch("password");
  const isLogin = mode === "login";
  const isSignup = mode === "signup";
  const isForgot = mode === "forgot";



  const titleMap: Record<AuthMode, string> = {
    login: "Welcome Back",
    signup: "Create Account",
    forgot: "Forgot Password",
  };

  const subtitleMap: Record<AuthMode, string> = {
    login: "Login to your account",
    signup: "Get started with your new account",
    forgot: "We'll send you a verification code",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200"
      >
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            BG
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">
            {titleMap[mode]}
          </h2>
          <p className="text-gray-500 text-sm">{subtitleMap[mode]}</p>
        </div>

        <div className="space-y-5">
          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  {...register("fullName", {
                    required: isSignup && "Full name is required",
                  })}
                  type="text"
                  placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {!isForgot && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Minimum 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                      message:
                        "Password must contain uppercase, lowercase, number, and special character",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          {isSignup && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-10 py-2.5 border rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {isSuccess && (
            <p className="text-green-600 text-sm text-center">Success!</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-2.5 rounded-lg text-white font-medium bg-indigo-600 hover:bg-indigo-700 transition-all ${
              isPending ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isPending
              ? mode === "signup"
                ? "Creating..."
                : mode === "login"
                ? "Logging in..."
                : "Sending..."
              : mode === "signup"
              ? "Create Account"
              : mode === "login"
              ? "Login"
              : "Send Reset Link"}
          </button>

          <div className="text-center text-sm text-gray-500 mt-3">
            {isLogin && (
              <>
                <p>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-indigo-600 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
                <p>
                  <Link
                    to="/forgot"
                    className="text-indigo-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </>
            )}
            {isSignup && (
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            )}
            {isForgot && (
              <p>
                Remember your password?{" "}
                <Link to="/login" className="text-indigo-600 hover:underline">
                  Login
                </Link>
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
