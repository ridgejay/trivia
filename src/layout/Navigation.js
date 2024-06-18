import React from 'react';
import { Link } from 'react-router-dom';

export default function Navigation() {


  return (
    <div className="flex justify-center space-x-4">
      <Link to="/settings" className="text-blue-500 hover:underline">Settings</Link>
      <Link to="/high-scores" className="text-blue-500 hover:underline">High Scores</Link>
      <Link to="/instructions" className="text-blue-500 hover:underline">Instructions</Link>
    </div>
  );
}
