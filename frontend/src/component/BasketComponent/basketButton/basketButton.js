import styless from './basketButton.module.css';
import { useState } from "react";
import { useBasket } from '../../../useContext/basketContext';
import { Link } from 'react-router-dom';

const BasketButton = ({ elem }) => {
    const [showAlert, setShowAlert] = useState(false);
    const {
        items: basketItems,
        addItem,
        removeItem,
        updateItem
    } = useBasket();

    const currentItem = basketItems.find(item => item.id === elem.id);
    const currentCount = currentItem ? currentItem.quantity : 0;

    const isKhinkali = [82, 174, 81, 83].includes(elem.id) ||
        (elem.title && elem.title.startsWith("Хинкали"));
    const minKhinkaliCount = 5;

    const showMinAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const showAddAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    const showAuthAlert = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };


    const handleRemoveFromCart = async () => {
        try {
            await removeItem(elem.id);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddToCart = async () => {

        try {

            if (isKhinkali) {
                if (currentCount === 0) {
                    await addItem(elem.id, minKhinkaliCount);
                    showAddAlert();
                } else {
                    await updateItem(elem.id, currentCount + 1);
                }
            } else {
                await addItem(elem.id, 1);
            }

        } catch (err) {
            console.log(err);
            if (err.message.includes('авторизация')) {
                showAuthAlert()
            }
        }
    };

    const handleDecreaseItem = async () => {
        if (isKhinkali && currentCount <= minKhinkaliCount) {
            showMinAlert();
            await handleRemoveFromCart();
            return;
        }

        try {
            await updateItem(elem.id, currentCount - 1);
        } catch (err) {
            console.log(err);
        }
    };

    const handleIncreaseItem = async () => {
        try {
            if (isKhinkali && currentCount <= minKhinkaliCount) {
                // Если хинкали нет в корзине, добавляем сразу 5
                await updateItem(elem.id, currentCount + 5);
                showAddAlert();
            } else {
                // Увеличиваем количество на 1
                await updateItem(elem.id, currentCount + 1);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <div className={styless.wrapper}>
            <form className={styless.formBtn} onSubmit={handleSubmit}>
                {currentCount ? (
                    <div className={styless.countContainer}>
                        <div className={styless.countBtn}>
                            <button
                                type="button"
                                className={styless.countDecrease}
                                onClick={handleDecreaseItem}
                            >
                                -
                            </button>
                            <span className={styless.countBasket}>{currentCount}</span>
                            <button
                                type="button"
                                className={styless.countIncrease}
                                onClick={handleIncreaseItem}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        type="button"
                        className={styless.btn}
                        onClick={handleAddToCart}
                    >
                        + В корзину
                    </button>
                )}
            </form>

            {showAlert && (
                <div className={styless.alertOverlay}>
                    <div className={styless.alertBox}>
                        <div className={styless.alertContent}>
                            <span className={styless.alertIcon}>⚠️</span>
                            <p>Минимальное количество хинкали - {minKhinkaliCount} шт. Товар удален из корзины.</p>
                        </div>
                    </div>
                </div>
            )}

            {showAlert && (
                <div className={styless.alertOverlay}>
                    <div className={styless.alertBox}>
                        <div className={styless.alertContent}>
                            <span className={styless.alertIcon}>⚠️</span>
                            <p>Минимальное количество хинкали - {minKhinkaliCount} шт. Товар добавлен в корзину.</p>
                        </div>
                    </div>
                </div>
            )}

            {showAlert && (
                <div className={styless.alertOverlay}>
                    <div className={styless.alertBox}>
                        <div className={styless.alertContent}>
                            <span className={styless.alertIcon}>🔒</span>
                            <p>Чтобы добавить товар в корзину, пожалуйста <Link to="/login" className={styless.authLink}>войдите</Link> или <Link to="/register" className={styless.authLink}>зарегистрируйтесь</Link></p>
                            <div className={styless.alertButtons}>
                                <Link to="/login" className={styless.alertButtonPrimary} onClick={() => setShowAlert(false)}>
                                    Войти
                                </Link>
                                <button className={styless.alertButtonSecondary} onClick={() => setShowAlert(false)}>
                                    Позже
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BasketButton;