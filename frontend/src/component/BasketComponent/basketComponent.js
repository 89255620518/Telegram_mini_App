import React from 'react';
import styles from './basket.module.scss';
import BasketItem from './BasketItem/basketItem';
import { useState } from 'react';
import { useBasket } from '../../useContext/basketContext';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBasket, FaUtensils, FaPlus } from 'react-icons/fa';

const BasketComponent = React.memo(() => {
    const { items, totalPrice, createOrder, clearBasket } = useBasket();
    const [deliveryData, setDeliveryData] = useState({
        city: '',
        street: '',
        house: '',
        entrance: '',
        apartment: '',
        deliveryDate: '',
        deliveryTime: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryData(prev => ({ ...prev, [name]: value }));
    };

    const handleClearBasket = async () => {
        try {
            await clearBasket();
        } catch (err) {
            setError('Не удалось очистить корзину');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Валидация полей
            if (Object.values(deliveryData).some(field => !field)) {
                throw new Error('Заполните все поля доставки');
            }

            if (!items.length) {
                throw new Error('Корзина пуста');
            }

            await createOrder({
                ...deliveryData,
                items: items.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                })),
                total: totalPrice
            });

            navigate('/order-success');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.containerBasket}>
            <h1 className={styles.title}>Корзина</h1>

            {items.length === 0 ? (
                <div className={styles.emptyBasketContainer}>
                    <div className={styles.emptyBasketContent}>
                        <FaShoppingBasket className={styles.basketIcon} />
                        <h2>Ваша корзина пуста</h2>
                        <p>Кажется, вы еще ничего не добавили в корзину</p>
                        <button
                            onClick={() => navigate('/menu')}
                            className={styles.menuButton}
                        >
                            <FaUtensils className={styles.menuIcon} />
                            Перейти в меню
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.itemsList}>
                        {items.map(item => (
                            <BasketItem key={`${item.id}_${item.quantity}`} item={item} />
                        ))}
                    </div>

                    <div className={styles.moreControls}>
                        <div className={styles.addMoreContainer}>
                            <button
                                onClick={() => navigate('/menu')}
                                className={styles.addMoreButton}
                            >
                                <FaPlus className={styles.addMoreIcon} />
                                Что-то еще?
                            </button>
                        </div>

                        <div className={styles.basketControls}>
                            {/* Кнопка очистки корзины */}
                            <button
                                onClick={handleClearBasket}
                                className={styles.clearButton}
                                disabled={isSubmitting}
                            >
                                Очистить корзину
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.deliveryForm}>
                        <h2>Данные для доставки</h2>

                        {['city', 'street', 'house', 'entrance', 'apartment'].map(field => (
                            <div key={field} className={styles.formGroup}>
                                <label htmlFor={field}>
                                    {{
                                        city: 'Город',
                                        street: 'Улица',
                                        house: 'Дом',
                                        entrance: 'Подъезд',
                                        apartment: 'Квартира'
                                    }[field]}
                                </label>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={deliveryData[field]}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        ))}

                        <div className={styles.formGroup}>
                            <label htmlFor="deliveryDate">Дата доставки</label>
                            <input
                                type="date"
                                id="deliveryDate"
                                name="deliveryDate"
                                value={deliveryData.deliveryDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="deliveryTime">Время доставки</label>
                            <input
                                type="time"
                                id="deliveryTime"
                                name="deliveryTime"
                                value={deliveryData.deliveryTime}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className={styles.orderSummary}>
                            <p>Товаров: {items.length} шт.</p>
                            <p>Общая сумма: {totalPrice} ₽</p>
                        </div>

                        {error && <p className={styles.error}>{error}</p>}

                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Оформляем...' : 'Оформить заказ'}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
});

export default BasketComponent;