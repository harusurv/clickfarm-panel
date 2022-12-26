import React from 'react'
import styled from 'styled-components'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './views/main'

const AppContainer = styled.div`
  background-image: linear-gradient(to right, #8e2de2, #4a00e0);
  width:100%;
  height:100%;
  display:flex;
  justify-content:center;
`
export default function App() {
  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}
