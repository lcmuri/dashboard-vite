import React from "react";

type AuthProtectedProps = {
  children: React.ReactNode;
};

const AuthProtected = ({ children }: AuthProtectedProps) => {
  // You can add auth logic here (e.g., check token, redirect, etc.)

  return <>{children}</>;
};

export default AuthProtected;
