import React from "react";

export const PageLoader = () => {
  const loadingImg = "https://cdn.auth0.com/blog/hello-auth0/loader.svg";

  return (
    <div className="loader w-screen h-screen flex items-center justify-center">
      <img className=" h-12" src={loadingImg} alt="Loading..." />
    </div>
  );
};
