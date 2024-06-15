// frontend/src/App.js
import React from 'react';
import TaskList from './components/TaskList';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <header className="App-header">
        <h1>Todo List App</h1>
      </header>
      <main>
        <TaskList />
      </main>
    </div>
    </ThemeProvider>
  );
}

export default App;
