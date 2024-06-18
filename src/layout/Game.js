import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import staticQuestions from "../components/StaticQuestions";
import ReadyButton from "../components/ReadyButton";
import { AnimatePresence, motion } from "framer-motion";
import correctSoundFile from "../assets/soundfx/correctSound.mp3";
import incorrectSoundFile from "../assets/soundfx/incorrectSound.mp3";

export default function Game() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const userName = params.get("name");
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [removedChoices, setRemovedChoices] = useState([]);

  const totalQuestions = staticQuestions.length;

  const navigate = useNavigate();

  const correctSound = new Audio(correctSoundFile);
  const incorrectSound = new Audio(incorrectSoundFile);

  const scoreVariants = {
    hidden: { scale: 1 },
    pulse: { scale: [1, 1.1, 1], transition: { duration: 1 } },
  };

  const handleAnswerSelection = (selectedChoice, isUserSelection = true) => {
    //updated selected choice

    if (isUserSelection) {
      setSelectedChoice(selectedChoice);
    }

    //find current question
    const currentQuestion = staticQuestions[currentQuestionIndex];

    const userAnswer = {
      question: currentQuestion.question,
      answer: selectedChoice,
      correctAnswer: currentQuestion.correctAnswer,
    };

    setAnswers((prevAnswers) => [...prevAnswers, userAnswer]);

    //check if selected choice is correct
    if (selectedChoice === currentQuestion.correctAnswer) {
      //if correct, add 10 points to score
      setScore((prevScore) => prevScore + 10);
      correctSound.play();
    } else {
      //if incorrect, subtract 10 points from the score (ensure, score doesn't go below 0)
      setScore((prevScore) => Math.max(prevScore - 10, 0));
      incorrectSound.play();
    }

    if (currentQuestionIndex === totalQuestions - 1) {
      const finalScore =
        score + (selectedChoice === currentQuestion.correctAnswer ? 10 : 0);
      setTimeout(() => {
        navigate("/game-over", {
          state: {
            userName,
            score: finalScore,
            totalQuestions,
            answers: [...answers, userAnswer],
          },
        });
      }, 2500);
    } else {
      //move to the next question
      setTimeout(() => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setSelectedChoice(null);
        setTimer(20);
      }, 2000);

      //reset timer for the next question
    }
  };

  //start timer when game starts
  useEffect(() => {
    let interval;
    if (gameStarted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 0) {
            return 0
          }else {
            return prevTimer - 1;
          }
        });
      }, 1000);
    }

    //cleanup interval on unmount or when game ends
    return () => clearInterval(interval);
  }, [gameStarted]);

  //handle game over when timer reaches 0 or no more questions remaining
  useEffect(() => {
    if (timer === 0) {
      handleAnswerSelection(null);
    } else if (currentQuestionIndex === totalQuestions) {
      navigate("/game-over");
    }
  }, [timer, currentQuestionIndex, totalQuestions, navigate]);

  //handle click on "ready to rock" button
  const handleStartGame = () => {
    setGameStarted(true);
    setTimer(20);
  };

  function getRandomElements(array, n) {
    const shuffled = array.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, n);
  }

  const handleFiftyFifty = () => {
    const currentQuestion = staticQuestions[currentQuestionIndex];

    const incorrectChoices = currentQuestion.choices.filter(
      (choice) => choice !== currentQuestion.correctAnswer
    );

    const removed = getRandomElements(incorrectChoices, 2);
    setRemovedChoices(removed);
  };

  //get current question and answer choices
  const currentQuestion = staticQuestions[currentQuestionIndex];

  const timerColor = timer > 10 ? "text-green-500" : "text-red-500";

  return (
    <div
      className="min-h-screen  flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bc47194c-4389-40b2-b130-e3de76db4ea0/dg2mw3n-378e0ef7-199f-4022-9f7b-ff2440ba69c2.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JjNDcxOTRjLTQzODktNDBiMi1iMTMwLWUzZGU3NmRiNGVhMFwvZGcybXczbi0zNzhlMGVmNy0xOTlmLTQwMjItOWY3Yi1mZjI0NDBiYTY5YzIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.11U3lSuQa5rTeFTxcLN5OZ9cvqJ1fMnX01PxrOQWuJs')`,
      }}
    >
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-serif mb-4 text-white">
            Welcome to the game, {userName}!
          </h1>
          <AnimatePresence>
            <motion.div
              className="mb-4"
              key={score}
              initial="hidden"
              animate="pulse"
              variants={scoreVariants}
            >
              <p className="text-md text-center  font-semibold text-white border p-2 bg-yellow-500">
                Your Score: {score}{" "}
              </p>
            </motion.div>
          </AnimatePresence>
          {gameStarted ? (
            <>
              <div
                className={`mb-4 font-bold bg-white p-2 rounded-md border-2 ${timerColor}`}
              >
                Timer: {timer}
              </div>
              <div>
                <h2 className="text-xl font-bold mb-4 text-white">
                  {currentQuestion.question}
                </h2>
                <ul>
                  {currentQuestion.choices.map((choice, index) => (
                    <li
                      key={index}
                      onClick={() => handleAnswerSelection(choice)}
                      className={`cursor-pointer ${
                        selectedChoice === choice &&
                        choice === currentQuestion.correctAnswer
                          ? "bg-green-500"
                          : "bg-blue-500"
                      } ${
                        selectedChoice === choice &&
                        choice !== currentQuestion.correctAnswer
                          ? "bg-red-500"
                          : "bg-blue-500"
                      } ${
                        removedChoices.includes(choice)
                          ? "opacity-50 disabled"
                          : ""
                      } mb-2 p-2 rounded-lg text-white hover:bg-gray-500 text-center`}
                    >
                      {choice}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleFiftyFifty}
                  className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md mt-4 "
                >
                  50/50 Lifeline
                </button>
              </div>
            </>
          ) : (
            <ReadyButton handleStartGame={handleStartGame} />
          )}
        </div> 
      </div>
    </div>
  );
}
