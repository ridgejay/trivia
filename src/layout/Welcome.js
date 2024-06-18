import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

import Navigation from "./Navigation";


export default function Welcome() {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  const handleStartGameTwo = () => {

    navigate(`/game?name=${encodeURIComponent(userName)}`)
  }



  return (
    <div
      className="relative min-h-screen overflow-hidden flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bc47194c-4389-40b2-b130-e3de76db4ea0/dg2mw3n-378e0ef7-199f-4022-9f7b-ff2440ba69c2.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JjNDcxOTRjLTQzODktNDBiMi1iMTMwLWUzZGU3NmRiNGVhMFwvZGcybXczbi0zNzhlMGVmNy0xOTlmLTQwMjItOWY3Yi1mZjI0NDBiYTY5YzIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.11U3lSuQa5rTeFTxcLN5OZ9cvqJ1fMnX01PxrOQWuJs')`,
      }}
    >
     
      <div className="flex flex-col justify-center items-center container mx-auto relative z-10 bg-gray-800 bg-opacity-75 p-6">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/2/27/Trivia.png"
          alt="Trivia Master Logo"
          className="h-16 w-auto mb-6"
        />
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Trivia Master 20
        </h1>
        <p className="text-md font-semibold text-white mb-6">
          Test your knowlege with 20 random trivia questions and have fun!
        </p>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <button
          onClick={handleStartGameTwo}
          className="bg-yellow-400 text-white font-bold mt-2 py-2 px-6 rounded-lg shadow-lg hover:bg-yellow-500 transition-colors duration-300"
        >
          Start Game
        </button>
        <div className="mt-8">
          <Navigation />
        </div>
      </div>
    </div>
  );
}
