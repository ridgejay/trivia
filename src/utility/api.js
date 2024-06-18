export async function fetchTriviaQuestions(amount, category, difficulty) {
//   const apiUrl = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`;

  try {
    const response = await fetch();
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results.map(question => ({
        question: question.question,
        options: [...question.incorrect_answers, question.correct_answer].sort(
          () => Math.random() - 0.5
        ),
        correctAnswer: question.correct_answer,
      }));
    } else {
      throw new Error("No trivia questions found");
    }
  } catch (error) {
    console.error("Error fetching trivia questions", error.message);
  }
}
