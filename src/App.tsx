import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CharacterSheetPage } from '@/pages/CharacterSheetPage';
import { HomePage } from '@/pages/HomePage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-ink-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<CharacterSheetPage />} />
          <Route path="/character/demo" element={<CharacterSheetPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
