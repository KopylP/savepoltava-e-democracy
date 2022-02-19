import React from "react";
import { Link, useLocation } from "react-router-dom";

export default ({ to, children }) => {
  const { pathname } = useLocation();
  var classes = pathname === to ? "nav-link active" : "nav-link";

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
};
