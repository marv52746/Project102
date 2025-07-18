import React from "react";
// import Signin from "../main/signin";
// import { useSelector } from "react-redux";
import { all_routes } from "../../routes/all_routes";
import { Link } from "react-router-dom";
// import Dashboard from "../private/Dashboard";

function Home() {
  // const authState = useSelector((state) => state.user.authState);
  return (
    // <Dashboard />
    <div className="h-screen flex flex-col items-center justify-center">
      Home
      <div>
        <Link to={all_routes.login}>Go to login page</Link>
      </div>
      {/* {!authState && <Signin />} */}
    </div>
  );
}

export default Home;
