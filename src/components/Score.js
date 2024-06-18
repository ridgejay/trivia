import { useSelector } from "react-redux";

export default function Score() {
    const score = useSelector(state => state.game.score);


  return (
    <div className="bg-white rounded-md p-4 shadow-md mb-8">
        <p className="text-lg font-semibold">Score: {score}</p>
    </div>
  )
}
