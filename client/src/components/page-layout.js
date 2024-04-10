import React from "react";

export const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <div className="page-layout__content">{children}</div>
    </div>
  );
};
