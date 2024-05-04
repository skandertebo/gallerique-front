import { useEffect } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useNavigate, useOutlet } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/auth.context";
export default function AuthPage(): JSX.Element {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const { user, whoAmiLoading } = useAuth();

  useEffect(() => {
    if (user && !whoAmiLoading) {
      navigate("/home");
    }
  }, [user, whoAmiLoading, navigate]);

  return (
    <div className="flex w-screen">
      <div className="flex-1 flex-col">
        <header className="p-8 flex flex-col">
          <img src={logo} alt="logo" className="w-40" />
          <h1 className="text-5xl text-center font-medium text-palette-6 mt-8">
            Join us
          </h1>
        </header>
        <div className="flex flex-col gap-2 px-20">
          {!whoAmiLoading ? (
            outlet
          ) : (
            <div className="flex h-full items-center">
              <AiOutlineLoading className="animate-spin h-10 w-10 mx-auto mt-32" />
            </div>
          )}
        </div>
      </div>
      <div className={`bg-login-bg flex-1 h-screen bg-center`}></div>
    </div>
  );
}
