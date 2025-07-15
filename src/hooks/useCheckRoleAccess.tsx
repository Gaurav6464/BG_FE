import { useQuery } from "@tanstack/react-query";
import User from "../api/auth";

const fetchRoleAccess = async () => {
  try {
    const res = await User.validateUserRole();
    return res.hasAccess;
  } catch (error) {
    console.log(error);
  }
};

export const useCheckRoleAccess = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["role-access"],
    queryFn: fetchRoleAccess,
  });

  return {
    hasAccess: data ?? false,
    loading: isLoading,
    error,
  };
};
