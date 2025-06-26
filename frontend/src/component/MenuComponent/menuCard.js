import { useState } from 'react';
import styles from './menu.module.scss';
import img from '../../image/vk.svg'



const MenuCard = ({ item }) => {
    const [showDescription, setShowDescription] = useState(false);

    return (
        <div className={styles.containerMenuCard}>
            {/* Изображение товара */}
            <img
                className={styles.menuImage}
                src={img}
                alt='Фото'
                onClick={() => setShowDescription(!showDescription)}
            />

            {/* Основная информация */}
            <div className={styles.menuContent}>
                <h3 className={styles.menuTitle}>{item.title}</h3>

                {/* Описание (появляется при клике) */}
                {showDescription && (
                    <p className={styles.menuDescription}>{item.description}</p>
                )}

                {/* Нижняя часть карточки */}
                <div className={styles.menuFooter}>
                    <div className={styles.menuDetails}>
                        {item.weight && <span className={styles.menuWeight}>{item.weight} г</span>}
                        <span className={styles.menuPrice}>{item.price} ₽</span>
                    </div>

                    <button className={styles.addToCartButton}>
                        <span>+</span> В корзину
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;