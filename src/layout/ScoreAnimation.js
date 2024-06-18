import React from 'react'

export default function ScoreAnimation({ score }) {
  return (
    <div className='relative text-5xl font-bold text-blue-500'>
        <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center'>
            <span className='text-lg text-gray-500'>Score: </span>
            <span className='ml-2'>{score}</span>
        </div>
        <div className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center animate-pulse'>
            <span className='text-lg text-gray-500'>Score: </span>
            <span className='ml-2'>{score}</span>
        </div>
        
    </div>
  )
}
