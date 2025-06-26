import './App.css';
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './component/Header/header';
import Footer from './component/Footer/footer';
import HomePage from './pages';
import AdminPage from './pages/admin';
import CabinetPage from './pages/cabinet';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import BasketPage from './pages/basket';
import { useState, useCallback } from 'react';
import MenuPage from './pages/Menu';
import TelegramWebAppInit from './component/TelegramWebAppInit/TelegramWebAppInit';
import PayPage from './pages/pay';
import OplataInfoPage from './pages/oplataInfo';
import VozvratPage from './pages/vozvrat';
import KonfidiPage from './pages/konfidi';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalOpen = useCallback(() => {
    document.body.classList.add('no-scroll');
    setIsModalOpen(true);
  }, []);

  const modalClosed = useCallback(() => {
    document.body.classList.remove('no-scroll');
    setIsModalOpen(false);
  }, []);

  const routes = [
    { path: '/admin', element: <AdminPage /> },
    { path: '/cabinet', element: <CabinetPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    { path: '/basket', element: <BasketPage /> },
    { path: '/menu', element: <MenuPage /> },
    { path: '/pay', element: <PayPage /> },
    { path: '/payInfo', element: <OplataInfoPage /> },
    { path: '/vozvrat', element: <VozvratPage /> },
    { path: '/policy', element: <KonfidiPage /> }
  ];

  return (
    <TelegramWebAppInit>
      <Helmet>
        <title>Дали-Хинкали кафе грузинской кухни с летней верандой</title>
        <meta name="description" content="БВ Дали-Хинкали бесплатная доставка по Орехово-Зуевскому району" />
        <meta name="yandex-verification" content="c2e397d2d61662dc" />
      </Helmet>

      <Router>
        <Header
          modalOpen={modalOpen}
          modalClosed={modalClosed}
          isModalOpen={isModalOpen}
        />

        <Routes>
          <Route
            path="/"
            element={<HomePage />}
            description="В Дали-Хинкали бесплатная доставка по Орехово-Зуевскому району"
          />
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>

        <Footer />
      </Router>
    </TelegramWebAppInit>
  );
}

export default App;