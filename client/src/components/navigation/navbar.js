import { LoginButton } from "../buttons/login-button";
import { LogoutButton } from "../buttons/logout-button";
import { SignupButton } from "../buttons/signup-button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  return (
    <div className="navbar bg-black text-white h-12">
      <div className="flex-1">
        <button onClick={() => navigate("/")} className="btn btn-ghost text-xl">
          ChatGen
        </button>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1 gap-5">
          {user && (
            <>
              <div className="dropdown dropdown-end">
                <div className=" flex gap-2 items-center">
                  <h1 className="hidden md:flex font-bold">
                    {user["nickname"]}
                  </h1>
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-10 rounded-full">
                      <img alt="Profile" src={user?.["picture"]} />
                    </div>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-black rounded-box w-52 gap-5"
                >
                  <li>
                    <a href="/profile" className="justify-between gap-5">
                      Profile
                    </a>
                  </li>
                  <LogoutButton />
                </ul>
              </div>
            </>
          )}
          {!user && (
            <>
              <li>
                <LoginButton />
              </li>
              <li>
                <SignupButton />
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
