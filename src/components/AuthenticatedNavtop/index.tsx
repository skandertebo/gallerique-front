import React, { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { IoNotifications } from "react-icons/io5";
import NotificationList from "./notificationList";

import { Link } from "react-router-dom";
import { UserSchema } from "../../api/auth/schemas/user.schema";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/auth.context";
import { useNotifications } from "../../context/notifications.context";

export interface AuthenticatedNavtopProps {
  user: UserSchema;
}

const AuthenticatedNavtop: React.FC<AuthenticatedNavtopProps> = ({ user }) => {
  const { logout } = useAuth();
  const { notifications, read, setRead } = useNotifications();
  const [showNotification, setShowNotifications] = useState(false);

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
          <Link to="/add-fund" className="text-sm underline text-palette-5">
            Add Fund
          </Link>
        </div>
        <div className="relative inline-block text-left cursor-pointer">
          <IoNotifications
            className="h-6 w-6"
            onClick={() => {
              setShowNotifications(!showNotification);
              setRead(true);
            }}
          />
          <div
            className={`absolute top-0 right-0 transform -translate-x-1/4 w-2 h-2 bg-red-600 rounded-full ${read ? "hidden" : ""}`}
          ></div>
          <div className="absolute -right-16 mt-8 w-80">
            {showNotification && (
              <NotificationList notifications={notifications} />
            )}
          </div>
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
