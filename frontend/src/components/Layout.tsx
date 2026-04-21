import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />
      {/* Outlet is where the current page's content will be injected */}
      <Outlet /> 
      <Footer />
    </>
  );
}