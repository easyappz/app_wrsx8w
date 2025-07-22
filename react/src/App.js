import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PhotoRatingPage from './pages/PhotoRatingPage';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/rating" element={<PhotoRatingPage />} />
          <Route path="*" element={<div>Страница не найдена</div>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
