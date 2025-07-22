import { Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const Signup = lazy(() => import("../pages/auth/Signup"));
const VerifyOtpOnSignup = lazy(() => import("../pages/auth/VerifyOtpSignup"));
const Login = lazy(() => import("../pages/auth/Login"));
const ForgetPassword = lazy(() => import("../pages/auth/ForgetPassword"));
const VerifyOtpForget = lazy(() => import("../pages/auth/VerifyOtpForget"));
const Loading = () => (
  <div className="flex items-center justify-center h-screen w-full bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-solid"></div>
  </div>
);


const PublicRoutes = (
  <>
    <Suspense fallback={<Loading />}>
    <Route path="/signup" element={<Signup />} />
    <Route path="/verify-otp-signup" element={<VerifyOtpOnSignup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/forgot" element={<ForgetPassword />} />
    <Route path="/verify-forget-password" element={<VerifyOtpForget />} />
    </Suspense>
  </>
);

export default PublicRoutes;
