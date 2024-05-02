import React from "react";

const VideoLogo = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover z-0 blur-sm "
      >
        <source src="assets/DonyatiEPM.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black opacity-50 z-10">
        <img
          className="loginLogo absolute top-0 left-0 mt-4 ml-4 w-20"
          src="/assets/Donyati-Logo.svg"
          alt="Donyati Logo"
        />
      </div>
    </div>
  );
};

export default VideoLogo;
