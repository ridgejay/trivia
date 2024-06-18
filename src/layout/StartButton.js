import React from 'react';
import { Link } from 'react-router-dom';


export default function StartButton() {
  return (
    <Link to="/questions" className='bg-green-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-green-600'>Start Game</Link>
  )
}
