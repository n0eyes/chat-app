import React, { useState } from "react";

function ImageExpansion({ imageURL, close }) {
  return (
    <div
      style={{
        backgroundColor: "rgba(255,255,255,0.6)",
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          position: "absolute",
          left: "40vw",
          top: "15vh",
        }}
      >
        <div
          style={{ fontSize: "30px", fontWeight: "bold", cursor: "pointer" }}
          onClick={() => close(false)}
        >
          CLOSE
        </div>
        <img
          src={imageURL}
          style={{
            maxWidth: "60vw",
            maxHeight: "60vh",
          }}
        />
      </div>
    </div>
  );
}

export default ImageExpansion;
