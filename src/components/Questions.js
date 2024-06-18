import React, { useState, useEffect } from "react";
import { fetchTriviaQuestions } from "../utility/api";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await fetchTriviaQuestions(10, 21, "hard");
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching trivia question", error);
      }
    };

    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelection = (selectedOption) => {
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        console.log("Congratulations! You completed the game!");
      }
    } else {
      console.log("Incorrect answer! Game over!");
    }
  };

  if (questions.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {currentQuestion && (
        <div className="bg-white p-4 shadow-md rounded-md">
          <h2 className="text-lg font-semibold mb-2">
            {currentQuestion.question}
          </h2>
          <ul className="list-disc pl-6">
            {currentQuestion.options.map((option, optionIndex) => (
              <li
                key={optionIndex}
                className="ml-2 cursor-pointer"
                onClick={() => handleAnswerSelection(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4">Score: {score}</div>
    </div>
  );
}
