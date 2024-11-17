import React from "react";
import Signin from "../main/signin";
import { useSelector } from "react-redux";

function Home() {
  const authState = useSelector((state) => state.user.authState);
  return (
    <div>
      Home
      {!authState && <Signin />}
    </div>
  );
}

export default Home;
