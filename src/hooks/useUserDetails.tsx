import { useQuery } from "@tanstack/react-query";
import User from "../api/auth"; // make sure this has getUserDetails()

const useUserDetails = () => {
  const isLogin = localStorage.getItem("isLogin");

  return useQuery({
    queryKey: ["user", isLogin],
    queryFn: () => User.getUserDetails(),
    enabled: !!isLogin, // only fetch if logged in
    staleTime: 5 * 60 * 1000, // optional: cache for 5 mins
  });
};

export default useUserDetails;
