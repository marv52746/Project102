import React from "react";
import { all_routes } from "../../routes/all_routes";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Create your account
        </h1>

        <div className="mb-4">
          <input
            placeholder="Email Address"
            type="email"
            name="email"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <input
            placeholder="Password"
            type="password"
            name="password"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-6">
          <input
            placeholder="Confirm Password"
            type="password"
            name="passwordCheck"
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600"
        >
          Continue
        </button>

        <div className="text-center mt-4">
          <p>
            Already have an account?{" "}
            <Link
              to={all_routes.login}
              className="text-blue-500 hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
