import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
      authorizationParams: {
        prompt: "signup",
      },
    });
  };

  return (
    <button
      className="btn btn-sm text-white bg-secondary hover:bg-secondary hover:bg-opacity-70"
      onClick={handleSignUp}
    >
      Sign Up
    </button>
  );
};
