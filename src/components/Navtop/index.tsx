import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import Button from "../Reusable/button";

export default function Navtop(): JSX.Element {
  return (
    <div className="flex justify-between items-center px-2 lg:px-36 py-2">
      <div className="flex items-center">
        <Link to="/">
          <img className="w-48 -mr-8" src={logo} alt="logo" />
        </Link>
        <h1 className="text-2xl hidden md:flex font-medium p-0 tracking-wider">
          GALLERIQUE
        </h1>
      </div>
      <div className="flex items-center gap-4 md:pe-24 md:text-sm">
        <Link to="/auth/login">
          <Button
            $variant="primary"
            $color="palette-6"
            className="px-12 md:max-w-36 max-w-20"
          >
            Login
          </Button>
        </Link>
        <Link to="/auth/register">
          <Button
            $variant="secondary"
            $color="palette-6"
            className="px-12 md:max-w-36 max-w-20"
          >
            Register
          </Button>
        </Link>
      </div>
    </div>
  );
}
