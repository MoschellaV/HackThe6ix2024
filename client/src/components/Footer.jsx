import React from "react";

export default function Footer() {
  return (
    <footer className="p-4 text-center">
      <p className="text-sm tracking-wider">
        Built by{" "}
        <a href="http://vincemoschella.com" target="_blank" rel="noopener noreferrer" className="underline">
          Vince Moschella
        </a>
        ,{" "}
        <a href="https://www.linkedin.com/in/aditosto/" target="_blank" rel="noopener noreferrer" className="underline">
          Adrian Di Tosto
        </a>
        , and{" "}
        <a href="https://danieldombrovsky.com/" target="_blank" rel="noopener noreferrer" className="underline">
          Daniel Dombrovsky
        </a>{" "}
        @ Hack The 6ix 2024
      </p>
    </footer>
  );
}
