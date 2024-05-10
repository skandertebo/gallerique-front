import { FaUserAlt } from "react-icons/fa";
import { UserSchema } from "../../api/auth/schemas/user.schema";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/auth.context";

export interface AuthenticatedNavtopProps {
  user: UserSchema;
}

const AuthenticatedNavtop: React.FC<AuthenticatedNavtopProps> = ({ user }) => {
  const { logout } = useAuth();
  return (
    <nav className="bg-palette-2 flex w-screen py-1 justify-between">
      <div className="flex items-center gap-2">
        <img src={logo} className="h-20" />
        <span className="text-xl font-medium hidden md:flex tracking-wider">
          GALLERIQUE
        </span>
      </div>
      <div className="flex place-items-center px-12 gap-4">
        <FaUserAlt className="h-8 w-8" />
        <div className="flex flex-col leading-4">
          <span className="font-medium">
            {user.firstName}&nbsp;{user.lastName}
          </span>
          <span className="text-sm">Credit: {user.credit}</span>
        </div>
        <span>
          <button className="underline text-palette-5" onClick={logout}>
            Logout
          </button>
        </span>
      </div>
    </nav>
  );
};

export default AuthenticatedNavtop;
