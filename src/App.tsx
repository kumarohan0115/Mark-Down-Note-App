import { useEffect } from 'react';
import { NotesProvider } from './contexts/NotesContext';
import Layout from './components/Layout';

function App() {
  useEffect(() => {
    document.title = 'Offline-First Notes App';
  }, []);

  return (
    <NotesProvider>
      <Layout />
    </NotesProvider>
  );
}

export default App;