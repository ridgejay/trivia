import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReadyButton from "../components/ReadyButton";
import { AnimatePresence, motion } from "framer-motion";
import correctSoundFile from "../assets/soundfx/correctSound.mp3";
import incorrectSoundFile from "../assets/soundfx/incorrectSound.mp3";
import axios from "axios";
import he from "he";

const API_URL = "https://opentdb.com/api.php?amount=20&difficulty=medium";

export default function GameDynamic() {
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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const correctSound = new Audio(correctSoundFile);
  const incorrectSound = new Audio(incorrectSoundFile);
  const [answerHandled, setAnswerHandled] = useState(false);
  const [lifelineUsed, setLifelineUsed] = useState(false);

  const getRandomElement = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };

  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  const scoreVariants = {
    hidden: { scale: 1 },
    pulse: { scale: [1, 1.1, 1], transition: { duration: 1 } },
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(API_URL);
      console.log("API response:", response.data);

      const questionsWithShuffledChoices = response.data.results.map(
        (question) => {
          // Combine correct and incorrect answers
          const allChoices = [
            ...question.incorrect_answers,
            question.correct_answer,
          ];

          // Shuffle the choices
          const shuffledChoices = allChoices.sort(() => Math.random() - 0.5);

          // Return a new question object with shuffled choices
          return {
            ...question,
            choices: shuffledChoices,
          };
        }
      );

      setQuestions(questionsWithShuffledChoices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (gameStarted && loading) {
      fetchQuestions();
    }
  }, [gameStarted, loading]);

  useEffect(() => {
    let interval;
    let noAnswerHandled = false;
    if (
      gameStarted &&
      !answerHandled &&
      !lifelineUsed &&
      questions.length > 0
    ) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1 && !noAnswerHandled) {
            console.log("Timer reached 0. Handling no answer selection.");
            clearInterval(interval);
            noAnswerHandled = true;
          
            handleNoAnswerSelection();
            return 0; // Stop at 0
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, answerHandled, lifelineUsed, questions]);

  const handleNoAnswerSelection = useCallback(() => {
    console.log(
      "handleNoAnswerSelection called. Current question index:",
      currentQuestionIndex
    );
    if (
      questions.length === 0 ||
      currentQuestionIndex < 0 ||
      currentQuestionIndex >= questions.length
    ) {
      console.error(
        "Current question index out of bounds or questions array is empty."
      );
      return;
    }
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      const incorrectChoices = currentQuestion.incorrect_answers;

      if (incorrectChoices && incorrectChoices.length > 0) {
        const randomIncorrectChoice = getRandomElement(incorrectChoices);
        console.log(
          "Random incorrect choice selected for no answer",
          randomIncorrectChoice
        );
        
        handleAnswerSelection(randomIncorrectChoice, true);
        setAnswerHandled(true);
      } else {
        console.error("current question has no incorrect answers");
      }
    } else {
      console.error("current question is undefined");
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswerSelection = useCallback(
    (selectedChoice, isTimeout = false) => {
      if (answerHandled) {
        console.log("Answer already handled, returning.");
        return;
      }
      setAnswerHandled(true);
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = selectedChoice === currentQuestion.correct_answer;
      console.log("User selected choice:", selectedChoice);
      console.log("Is correct answer:", isCorrect);
      setSelectedChoice(selectedChoice);
      const userAnswer = {
        question: currentQuestion.question,
        answer: selectedChoice,
        correctAnswer: currentQuestion.correct_answer,
        isTimeout: isTimeout,
      };
      if (!answers.some((a) => a.question === userAnswer.question)) {
        setAnswers((prevAnswers) => [...prevAnswers, userAnswer]);
      }
      if (isCorrect) {
        setScore((prevScore) => prevScore + 10);
        correctSound.play();
      } else {
        setScore((prevScore) => Math.max(prevScore));
        incorrectSound.play();
      }
      setTimeout(() => {
        if (currentQuestionIndex === questions.length - 1) {
          setTimeout(() => {
            setAnswerHandled(false);
            handleEndOfGame();
          }, 2700);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedChoice(null);
          setTimer(20);
          setAnswerHandled(false);
          setLifelineUsed(false);
          setRemovedChoices([]);
        }
      }, 2500);
    },
    [answerHandled, currentQuestionIndex, questions, answers]
  );

  const handleEndOfGame = useCallback(() => {
    console.log("handleEndOfGame called, final answer length:", answers.length);
    
    setAnswers((prevAnswers) => {
      const finalScore = score;
      navigate("/game-over", {
        state: {
          userName,
          score: finalScore,
          totalQuestions: questions.length,
          answers: prevAnswers,
        },
      });
      return prevAnswers
    });
  }, [navigate, score, questions.length, answers, userName]);

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      console.log("api response", response.data);
      const questionsWithShuffledChoices = response.data.results.map(
        (question) => {
          const allChoices = [
            ...question.incorrect_answers,
            question.correct_answer,
          ];
          const shuffledChoices = allChoices.sort(() => Math.random() - 0.5);
          return {
            ...question,
            choices: shuffledChoices,
          };
        }
      );
      setQuestions(questionsWithShuffledChoices);
      setLoading(false);
      setGameStarted(true);
      setTimer(20);
    } catch (error) {
      console.error("error fetching questions", error);
      setLoading(false);
    }
  };

  const handleFiftyFifty = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const incorrectChoices = currentQuestion.incorrect_answers;
    const removed = getRandomElements(incorrectChoices, 2);
    setRemovedChoices(removed);
    setLifelineUsed(true);
  };

  const getRandomElements = (array, n) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const timerColor = timer > 10 ? "text-green-500" : "text-red-500";

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bc47194c-4389-40b2-b130-e3de76db4ea0/dg2mw3n-378e0ef7-199f-4022-9f7b-ff2440ba69c2.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JjNDcxOTRjLTQzODktNDBiMi1iMTMwLWUzZGU3NmRiNGVhMFwvZGcybXczbi0zNzhlMGVmNy0xOTlmLTQwMjItOWY3Yi1mZjI0NDBiYTY5YzIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.11U3lSuQa5rTeFTxcLN5OZ9cvqJ1fMnX01PxrOQWuJs')`,
      }}
    >
      <div className="container mx-auto bg-gray-800 bg-opacity-75 p-6 rounded-lg">
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
              <p className="text-md text-center font-semibold text-white border-yellow-500 rounded-md p-2 bg-yellow-500">
                Your Score: {score}
              </p>
            </motion.div>
          </AnimatePresence>

          <div>
            {gameStarted && currentQuestion ? (
              <>
                <h2 className="text-xl font-bold mb-4 text-white text-center max-w-md">
                  {he.decode(currentQuestion.question)}
                </h2>
                {gameStarted && currentQuestion ? (
                  <div
                    className={`mb-4 text-center font-bold  p-2 rounded-md border-2 ${timerColor}`}
                  >
                    Timer: {timer}
                  </div>
                ) : null}
                <div className="flex flex-col justify-center items-center">
                  <h1 className="text-2xl font-serif mb-4 text-white">{`Question ${
                    currentQuestionIndex + 1
                  } / ${questions?.length || 1}`}</h1>
                  <div className="w-full bg-gray-300 h-4 rounded-lg mb-4">
                    <div
                      className="bg-blue-500 h-full rounded-lg"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <ul>
                    {currentQuestion.choices.map((choice, index) => {
                      const isRemoved = removedChoices.includes(choice);
                      const isCorrect =
                        choice === currentQuestion.correct_answer;
                      const isSelected = selectedChoice === choice;

                      const isCorrectlySelected = isSelected && isCorrect;
                      const isIncorrectlySelected = isSelected && !isCorrect;

                      return (
                        <li
                          key={index}
                          onClick={() => handleAnswerSelection(choice)}
                          className={`cursor-pointer bg-blue-500 mb-2 p-2 rounded-lg text-white hover:bg-blue-700 text-center ${
                            isCorrectlySelected
                              ? "bg-green-500"
                              : isIncorrectlySelected
                              ? "bg-red-500"
                              : ""
                          } ${isRemoved ? "opacity-50 disabled" : ""}`}
                          style={{
                            pointerEvents: isRemoved ? "none" : "auto",
                            width: "300px",
                          }}
                        >
                          {he.decode(choice)}
                        </li>
                      );
                    })}
                  </ul>
                  {!lifelineUsed && (
                    <button
                      onClick={handleFiftyFifty}
                      className="bg-yellow-500 p-2 rounded-lg text-white mt-4"
                    >
                      50/50 Lifeline
                    </button>
                  )}
                </div>
              </>
            ) : (
              <ReadyButton onClick={handleStartGame} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
