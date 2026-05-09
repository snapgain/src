import React from "react";
import { Helmet } from "react-helmet";

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
        <div className="max-w-md w-full text-center border border-gray-200 bg-white rounded-2xl p-8 shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-r from-[#7D4DFB] to-[#FF3FCE] flex items-center justify-center mb-5">
            <span className="text-white font-bold text-xl">S</span>
          </div>

          <h1 className="text-2xl font-bold mb-2">We’re under construction</h1>
          <p className="text-muted-foreground">
            We’re working behind the scenes to bring you something great.
            Please check back soon.
          </p>

          {/* intentionally no sign-in link here */}
          <p className="text-xs text-muted-foreground mt-6">
            © {new Date().getFullYear()} SnapGain
          </p>
        </div>
      </div>
    </>
  );
}
