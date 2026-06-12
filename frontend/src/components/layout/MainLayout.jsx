import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import TopMarquee from '../ui/TopMarquee';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="main-content">
        <TopMarquee />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
