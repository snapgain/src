import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Maintenance() {
  return (
    <>
      <Helmet>
        <title>SnapGain — Under construction</title>
        <meta name="robots" content="noindex" />
        <meta
          name="description"
          content="We’re improving SnapGain for you. Please check back soon."
        />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] flex items-center justify-center mb-6">
            <span className="text-white font-bold text-2xl">S</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">We’re under construction</h1>
          <p className="text-muted-foreground">
            We’re working behind the scenes to bring you something great.
            Please check back soon.
          </p>

          {/* Opcional: acesso da equipa */}
          <div className="mt-8">
            <Link
              to="/auth/login"
              className="inline-block px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Sign in
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} SnapGain
          </p>
        </div>
      </div>
    </>
  );
}
