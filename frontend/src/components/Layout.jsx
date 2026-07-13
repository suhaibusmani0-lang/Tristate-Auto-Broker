import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <Header />
      <main className="flex-1 bg-black">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
