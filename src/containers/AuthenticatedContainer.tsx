import { useLayoutEffect } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../context/auth.context";

export default function AuthenticatedContainer(): JSX.Element | null {
  const { user, whoAmiLoading } = useAuth();
  const navigate = useNavigate();
  const outlet = useOutlet();
  useLayoutEffect(() => {
    if (!user && !whoAmiLoading) {
      navigate("/auth/login");
    }
  }, [user, whoAmiLoading, navigate]);
  return outlet;
}
