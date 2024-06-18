import React from 'react'

export default function AudioPlayer({src}) {
 
   

  return (
    <div className='fixed bottom-0 w-full bg-gray-900 bg-opacity-50 py-4 '>

        <audio controls style={{ width: '100%', maxWidth: '200px', color: 'blue'}}>
                    <source src={src} type="audio/mpeg" />
        </audio>
    </div>
  )
}
