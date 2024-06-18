import React from "react";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {motion} from 'framer-motion';
import he from 'he';


export default function FinalResults() {
  const location = useLocation();
  const { userName, score, totalQuestions, answers } = location.state || {};
  console.log("finalResults received answers length", answers.length);

const maxScore = totalQuestions * 10;

const totalCorrectAnswers = answers && answers.length > 0 ? answers.reduce((total, answer) => answer.answer === answer.correctAnswer ? total + 1: total, 0) : 0;

  const percentageCorrect = (totalCorrectAnswers / totalQuestions) * 100;

  let grade;
  if (percentageCorrect === 100) {
    grade = "A+";
  } else if (percentageCorrect >= 90) {
    grade = "A";
  } else if (percentageCorrect >= 80) {
    grade = "B";
  } else if (percentageCorrect >= 70) {
    grade = "C";
  } else if (percentageCorrect >= 60) {
    grade = "D";
  } else {
    grade = "F";
  }





  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/bc47194c-4389-40b2-b130-e3de76db4ea0/dg2mw3n-378e0ef7-199f-4022-9f7b-ff2440ba69c2.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2JjNDcxOTRjLTQzODktNDBiMi1iMTMwLWUzZGU3NmRiNGVhMFwvZGcybXczbi0zNzhlMGVmNy0xOTlmLTQwMjItOWY3Yi1mZjI0NDBiYTY5YzIuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.11U3lSuQa5rTeFTxcLN5OZ9cvqJ1fMnX01PxrOQWuJs')`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-5xl mb-8 text-white">{`Game Over, ${userName}!`}</h1>
      <div className="bg-gray-800 bg-opacity-75 text-white font-bold rounded-lg px-4 py-2 mb-4">
        <p>
          Final Score: {score}/{maxScore} (Points Earned)
        </p>
        <p>Correct Answers: {totalCorrectAnswers}/{totalQuestions} ({percentageCorrect.toFixed(0)}%)</p>
        <p>Grade: {grade}</p>
      </div>
      <div className="bg-gray-800 bg-opacity-75 rounded-lg p-4 mb-4 overflow-y-auto shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-white">Question and Answer Results</h2>
        <div className="grid grid-cols-1 gap-4">
          {answers && answers.map((answer, index) => (
            <div key={index} className="border p-4 rounded-md bg-gray-100">
              <p className="font-semibold">Question {index + 1}</p>
              <p className="mb-2">{he.decode(answer.question)}</p>
              <p
                style={{
                  color:
                    answer.answer === answer.correctAnswer
                      ? "#10B981"
                      : "#EF4444",
                }}
              >
                Your Answer: {he.decode(answer.answer) || 'No answer provided'} (
                {he.decode(answer.answer) === answer.correctAnswer
                  ? "Correct"
                  : "Incorrect"}
                )
              </p>
              <p className="text-gray-600">
                Correct Answer: {he.decode(answer.correctAnswer)}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Link
        to="/"
        className="text-white bg-yellow-500 hover:bg-yellow-600 rounded px-4 py-2 mb-8"
      >
        Return to Home
      </Link>
    </motion.div>
  );
}
