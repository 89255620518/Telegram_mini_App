import styles from './banner.module.scss';
import mainMenu from './img/main.jpg';
import beverage from './img/bavarage.jpg';
import biznes from './img/biznes.jpg';
import service from './img/addServicesBanner.jpeg';
import { Link } from 'react-router-dom';

const BannerComponent = () => {
    return (
        <div className={styles.containerBanner}>
            <div className={styles.containerBanner__content}>
                <Link to='/menu' className={styles.menuItem}>
                    <div className={`${styles.menuImage} ${styles.mainMenu}`}>
                        <img src={mainMenu} alt="Основное меню Дали-Хинкали" />
                    </div>
                    <p className={styles.menuText}>Основное меню</p>
                </Link>

                <div className={styles.menuItem}>
                    <div className={`${styles.menuImage} ${styles.beverage}`}>
                        <img src={beverage} alt="Напитки Дали-Хинкали" />
                    </div>
                    <p className={styles.menuText}>Напитки</p>
                </div>

                <div className={styles.menuItem}>
                    <div className={`${styles.menuImage} ${styles.business}`}>
                        <img src={biznes} alt="Бизнес ланч Дали-Хинкали" />
                    </div>
                    <p className={styles.menuText}>Бизнес ланч</p>
                </div>

                <div className={styles.menuItem}>
                    <div className={`${styles.menuImage} ${styles.service}`}>
                        <img src={service} alt="Бизнес ланч Дали-Хинкали" />
                    </div>
                    <p className={styles.menuText}>Доп услуги</p>
                </div>
            </div>
        </div>
    )
}

export default BannerComponent;