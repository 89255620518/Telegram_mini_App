import styles from './additionalServices.module.scss';
import dopfoto from '../Banner/img/addServicesBanner.jpeg';
import { useState } from 'react';

const AdditionalServicesComponent = () => {
    const [items, setItems] = useState([
        { name: 'Ягненок', price: 3000, quantity: 0 },
        { name: 'Поросенок', price: 3000, quantity: 0 },
        { name: 'Утка', price: 1500, quantity: 0 },
        { name: 'Гусь', price: 1500, quantity: 0 },
        { name: 'Кролик', price: 1500, quantity: 0 }
    ]);
    const [comment, setComment] = useState('');

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 0) return;
        const newItems = [...items];
        newItems[index].quantity = newQuantity;
        setItems(newItems);
    };

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className={styles.containerServices}>
            <div className={styles.containerServices__content}>
                <div className={styles.containerServices__content__info}>
                    <img
                        className={styles.containerServices__content__info_img}
                        src={dopfoto}
                        alt='Допуслуги Дали-Хинкали'
                    />
                    <p className={styles.containerServices__content__info_text}>Доп услуги</p>
                </div>

                <div className={styles.containerServices__content__menu}>
                    <p className={styles.containerServices__content__menu_text}>
                        Наша услуга представляет собой идеальное решение для занятых людей, ценящих вкус и качество в каждом приеме пищи, но не имеющих достаточно времени на подготовку. Мы замаринуем и приготовим ваше мясо на мангале на вертеле с нежностью и вниманием к каждой детали.
                        <span className={styles.containerServices__content__menu_text_span}>Наши повара - настоящие мастера своего дела, они заботятся о выборе приправ и специй, чтобы вкус был настоящим кулинарным открытием.</span>
                    </p>

                    <div className={styles.containerServices__content__menu_services}>
                        {items.map((item, index) => (
                            <div key={index} className={styles.serviceItem}>
                                <span className={styles.serviceName}>{item.name} - {item.price} руб</span>
                                <div className={styles.quantityControls}>
                                    <button
                                        onClick={() => updateQuantity(index, item.quantity - 1)}
                                        className={styles.quantityButton}
                                    >
                                        -
                                    </button>
                                    <span className={styles.quantityValue}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(index, item.quantity + 1)}
                                        className={styles.quantityButton}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className={styles.divider}></div>

                        <div className={styles.totalSection}>
                            <div className={styles.totalRow}>
                                <span className={styles.totalRow_span}>Итог:</span>
                                <span className={styles.totalAmount}>{total} руб</span>
                            </div>

                            <textarea
                                className={styles.commentArea}
                                placeholder="Комментарий к заказу"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />

                            <button className={styles.orderButton}>
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdditionalServicesComponent;