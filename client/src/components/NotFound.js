import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container max-w-sm flex-1 flex flex-col items-center justify-center">
      <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
        <h1 className="font-bold text-gray-500 text-center text-9xl">404</h1>
        <h5 className="font-bold text-gray-500 text-center text-2xl">
          Page Not Found
        </h5>
        <div className="w-full flex justify-center items-center">
          <Link
            to={"/"}
            className="mt-5 w-full text-center py-3 rounded bg-gray-400 text-gray-50 shadow-md"
          >
            Go Back to Safety!
          </Link>
        </div>
      </div>
    </div>
  );
}
