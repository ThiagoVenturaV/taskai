import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header/Header';
import { AskAIBar } from './components/AskAIBar/AskAIBar';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { LoginModal } from './components/LoginModal/LoginModal';
import { ShareModal } from './components/ShareModal/ShareModal';
import { RegisterPage } from './components/RegisterPage/RegisterPage';

function AppRoutes() {
  const { page, isLoginModalOpen, isShareModalOpen } = useApp();

  if (page === 'register') {
    return <RegisterPage />;
  }

  return (
    <>
      <Header />
      <AskAIBar />
      <KanbanBoard />

      {isLoginModalOpen && <LoginModal />}
      {isShareModalOpen && <ShareModal />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
