import React from 'react';
import './App.css';

import Home from './components/Home'
import UserCard from './components/Person/PersonCard'

function App() {
  return (
    <div className="App">
      <UserCard></UserCard>
      <Home></Home>
    </div>
  );
}

export default App;
