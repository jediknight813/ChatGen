import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <button
      className="btn btn-sm text-white bg-red-600 hover:bg-red-600  hover:bg-opacity-70"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};
