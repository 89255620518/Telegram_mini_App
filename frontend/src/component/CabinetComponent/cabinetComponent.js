import { useState } from 'react';
import styles from './cabinet.module.scss';

const CabinetComponent = () => {
    // Данные пользователя
    const [userData, setUserData] = useState({
        firstName: 'Иван',
        lastName: 'Иванов',
        phone: '+7 (123) 456-78-90',
        email: 'ivan@example.com',
        avatar: 'https://via.placeholder.com/150',
    });

    // Адрес пользователя
    const [userAddress, setUserAddress] = useState({
        city: 'Москва',
        street: 'Ленина',
        house: '10',
        apartment: '25',
        entrance: '3',
        intercom: '1234',
        comment: 'Оставить у двери',
    });

    // Заказы пользователя
    // eslint-disable-next-line no-unused-vars
    const [orders, setOrders] = useState([
        {
            id: 1,
            date: '2023-05-15',
            items: ['Товар 1', 'Товар 2', 'Товар 3'],
            total: 12500,
        },
        {
            id: 2,
            date: '2023-06-20',
            items: ['Товар 4', 'Товар 5'],
            total: 8700,
        },
    ]);

    // Состояния модальных окон
    const [isDataModalOpen, setIsDataModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);

    // Обработчики изменений данных
    const handleDataChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    // Обработчики изменений адреса
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUserAddress(prev => ({ ...prev, [name]: value }));
    };

    // Сохранение данных
    const handleSaveData = () => {
        // Здесь можно добавить логику сохранения на сервер
        setIsDataModalOpen(false);
    };

    // Сохранение адреса
    const handleSaveAddress = () => {
        // Здесь можно добавить логику сохранения на сервер
        setIsAddressModalOpen(false);
    };

    // Выход из аккаунта
    const handleLogout = () => {
        // Логика выхода
        console.log('Пользователь вышел');
    };

    return (
        <div className={styles.containerCabinet}>
            {/* Шапка профиля */}
            <div className={styles.profileHeader}>

                <h2 className={styles.userName}>
                    {userData.firstName} {userData.lastName}
                </h2>
            </div>

            {/* Меню личного кабинета */}
            <div className={styles.menu}>
                <button
                    className={styles.menuButton}
                    onClick={() => setIsDataModalOpen(true)}
                >
                    <span className={styles.icon}>👤</span>
                    <span className={styles.menuButton_span}>Мои данные</span>
                </button>

                <button
                    className={styles.menuButton}
                    onClick={() => setIsAddressModalOpen(true)}
                >
                    <span className={styles.icon}>🏠</span>
                    <span className={styles.menuButton_span}>Мой адрес</span>
                </button>

                <button
                    className={styles.menuButton}
                    onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                >
                    <span className={styles.icon}>📦</span>
                    <span className={styles.menuButton_span}>Мои заказы</span>
                </button>

                <button
                    className={`${styles.menuButton} ${styles.logoutButton}`}
                    onClick={handleLogout}
                >
                    <span className={styles.icon}>🚪</span>
                    <span className={styles.menuButton_span}>Выйти</span>
                </button>
            </div>

            {/* Модальное окно "Мои данные" */}
            {isDataModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modal_h3}>Мои данные</h3>
                        <div className={styles.formGroup}>
                            <label>Имя</label>
                            <input
                                type="text"
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleDataChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleDataChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Телефон</label>
                            <input
                                type="tel"
                                name="phone"
                                value={userData.phone}
                                onChange={handleDataChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Почта</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleDataChange}
                            />
                        </div>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsDataModalOpen(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={handleSaveData}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно "Мой адрес" */}
            {isAddressModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 className={styles.modal_h3}>Мой адрес</h3>
                        <div className={styles.formGroup}>
                            <label>Город</label>
                            <input
                                type="text"
                                name="city"
                                value={userAddress.city}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Улица</label>
                            <input
                                type="text"
                                name="street"
                                value={userAddress.street}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Дом</label>
                            <input
                                type="text"
                                name="house"
                                value={userAddress.house}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Квартира</label>
                            <input
                                type="text"
                                name="apartment"
                                value={userAddress.apartment}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Подъезд</label>
                            <input
                                type="text"
                                name="entrance"
                                value={userAddress.entrance}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Домофон</label>
                            <input
                                type="text"
                                name="intercom"
                                value={userAddress.intercom}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Комментарий</label>
                            <input
                                type="text"
                                name="comment"
                                value={userAddress.comment}
                                onChange={handleAddressChange}
                            />
                        </div>
                        <div className={styles.modalButtons}>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsAddressModalOpen(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className={styles.saveButton}
                                onClick={handleSaveAddress}
                            >
                                Сохранить изменения
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Блок "Мои заказы" */}
            {isOrdersOpen && (
                <div className={styles.ordersSection}>
                    <h3 className={styles.modal_h3}>Мои заказы</h3>
                    {orders.length > 0 ? (
                        <div className={styles.ordersList}>
                            {orders.map(order => (
                                <div key={order.id} className={styles.orderItem}>
                                    <div className={styles.orderHeader}>
                                        <span className={styles.orderDate}>Дата: {order.date}</span>
                                        <span className={styles.orderTotal}>Сумма: {order.total} ₽</span>
                                    </div>
                                    <ul className={styles.orderItems}>
                                        {order.items.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className={styles.noOrders}>Нет заказов</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CabinetComponent;