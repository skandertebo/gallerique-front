import { useMutation, useQuery } from "@apollo/client";
import { createContext, useContext, useEffect, useState } from "react";
import AUTH_QUERIES from "../api/auth/auth.queries";
import { RegisterDto } from "../api/auth/dto/register.dto";
import { AuthSchema } from "../api/auth/schemas/auth.schema";
import { UserSchema } from "../api/auth/schemas/user.schema";

export type AuthContextProps = {
  user: UserSchema | null;
  login: (email: string, password: string) => Promise<void>;
  register: (registerDto: RegisterDto) => Promise<void>;
  accessToken: string | null;
  logout: () => void;
  whoAmiLoading: boolean;
  loginLoading: boolean;
  registerLoading: boolean;
};

export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<UserSchema | null>(null);
  const [accessToken, _setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken") || null
  );

  const setAccessToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
    _setAccessToken(token);
  };

  const [registerUser, { loading: registerLoading }] = useMutation<{
    register: AuthSchema;
  }>(AUTH_QUERIES.REGISTER);
  const onRegister = async (values: RegisterDto) => {
    await registerUser({
      variables: {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        address: values.address,
      },
    });
  };

  const [loginUser, { loading: loginLoading }] = useMutation<{
    login: AuthSchema;
  }>(AUTH_QUERIES.LOGIN);

  const {
    data: whoAmiData,
    loading: whoAmiLoading,
    error: whoAmiError,
  } = useQuery<{ whoAmI: UserSchema }>(AUTH_QUERIES.WHOAMI);

  useEffect(() => {
    if (whoAmiData?.whoAmI) setUser(whoAmiData?.whoAmI);
    else if (whoAmiError) {
      setUser(null);
      setAccessToken(null);
    }
  }, [whoAmiData, whoAmiLoading, whoAmiError]);

  const login = async (email: string, password: string) => {
    const res = await loginUser({
      variables: {
        email,
        password,
      },
    });
    if (res.data?.login.user) setUser(res.data?.login.user);
    if (res.data?.login.access_token)
      setAccessToken(res.data?.login.access_token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register: onRegister,
        accessToken,
        logout,
        whoAmiLoading,
        loginLoading,
        registerLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
