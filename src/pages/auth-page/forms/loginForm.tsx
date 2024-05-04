import { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Link } from "react-router-dom";
import Button from "../../../components/Reusable/button";
import Input from "../../../components/Reusable/input";
import { useAuth } from "../../../context/auth.context";

export default function LoginForm() {
  const { login, loginLoading: loading } = useAuth();
  const [error, setError] = useState<string>("");
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: any = {};
    formData.forEach((value, key) => {
      values[key] = value;
    });
    setError("");
    login(values.email, values.password).catch((err) => {
      setError(err.message);
    });
  };
  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Email"
        className="rounded-3xl text-palette-2 border-2"
        name="email"
      />
      <Input
        type="password"
        placeholder="Password"
        className="rounded-3xl text-palette-2 border-2"
        name="password"
      />
      {<p className="text-red-500 text-center min-h-10">{error}</p>}
      <Button
        className="w-fit min-w-48 px-12 font-medium rounded-3xl mx-auto"
        disabled={loading}
      >
        {loading ? (
          <AiOutlineLoading className="animate-spin h-5 w-5" />
        ) : (
          "Login"
        )}
      </Button>
      <p className="text-center text-palette-2 mt-4">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="text-palette-3 underline underline-offset-1"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
