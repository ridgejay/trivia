import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setQuestions(state, action) {
            state.questions = action.payload
        },
        setCurrentQuestionIndex(state, action) {
            state.currentQuestionIndex = action.payload;
        },
        incrementScore(state) {
            state.score += 1;
        },
        resetGame(state) {
            state.score = 0;
            state.currentQuestionIndex = 0;
        }
    }
    
});


export const {
   setQuestions,
   setCurrentQuestionIndex,
   incrementScore,
   resetGame
} = gameSlice.actions;

export default gameSlice.reducer;