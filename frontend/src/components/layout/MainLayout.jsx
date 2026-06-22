import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TopMarquee from '../ui/TopMarquee';
import LiveChatWidget from '../chat/LiveChatWidget';

export default function MainLayout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Header />
      <main className="main-content">
        {isHomePage && <TopMarquee />}
        <Outlet />
      </main>
      <Footer />
      <LiveChatWidget />
    </>
  );
}
