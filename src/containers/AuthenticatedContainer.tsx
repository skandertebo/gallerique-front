import React, { useLayoutEffect } from "react";
import { useNavigate, useOutlet } from "react-router-dom";
import AuthenticatedNavtop from "../components/AuthenticatedNavtop";
import AuctionsProvider from "../context/auctions.context";
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
  if (!user) return null;
  return (
    <AuctionsProvider user={user}>
      <div className="flex flex-col">
        <AuthenticatedNavtop user={user} />
        {React.cloneElement(outlet!, { user })}
      </div>
    </AuctionsProvider>
  );
}
