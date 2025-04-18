import { Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import PageContent from './layout/PageContent';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <PageContent>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </PageContent>
      <Footer />
    </div>
  );
}

export default App