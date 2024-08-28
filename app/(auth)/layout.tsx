import React from "react";
import {ILayout} from "@/type";

const AuthLayout = ({ children }:ILayout) => {
  return (
    <div className={"h-full w-full flex items-center justify-center"}>
      {children}
    </div>
  );
};

export default AuthLayout;
