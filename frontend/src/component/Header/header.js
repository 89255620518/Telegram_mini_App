import { Link } from 'react-router-dom';
import styles from './header.module.scss';
import logo from '../../image/logo.1.png';
import { useState, useEffect } from 'react';

const Header = ({
    modalOpen,
    modalClosed,
    isModalOpen,
    // isWebApp = false
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Для WebApp всегда показываем мобильную версию
    const displayMobile = isMobile;

    // Специальная кнопка "Назад" для WebApp

    return (
        <div className={`${styles.containerHeader} ${styles.webAppHeader}`}>
            <div className={styles.headerContent}>
                {displayMobile ? (
                    <>
                        <button
                            className={`${styles.burgerButton} ${isModalOpen ? styles.open : ''}`}
                            onClick={isModalOpen ? modalClosed : modalOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>

                        {isModalOpen && (
                            <div className={styles.mobileMenu}>
                                <div className={styles.mobileMenuContent}>
                                    <Link to={'/'} onClick={modalClosed}><span>Главная</span></Link>
                                    <Link to={'/menu'} onClick={modalClosed}><span>Меню</span></Link>
                                    <button onClick={modalClosed}><span>Резерв Стола</span></button>
                                    <button onClick={modalClosed}><span>Доставка</span></button>
                                    <button onClick={modalClosed}><span>Банкеты</span></button>
                                    <button onClick={modalClosed}><span>Такси</span></button>
                                    <button onClick={modalClosed}><span>Контакты</span></button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className={styles.desktopMenu}>
                        <Link to={'/'}><span>Главная</span></Link>
                        <Link to={'/menu'}><span>Меню</span></Link>
                        <button><span>Резерв Стола</span></button>
                        <button><span>Доставка</span></button>
                        <button><span>Банкеты</span></button>
                        <button><span>Такси</span></button>
                        <button><span>Контакты</span></button>
                    </div>
                )}

                <Link to="/" className={styles.logoContainer}>
                    <img src={logo} alt='Логотип Дали-Хинкали' className={styles.logo} />
                </Link>

                {isAuth ? (
                    <>
                        <Link to="/cabinet" className={styles.iconButton}>👤</Link>
                        <Link to="/basket" className={styles.iconButton}>🛒</Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={styles.authButton}>Войти</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;