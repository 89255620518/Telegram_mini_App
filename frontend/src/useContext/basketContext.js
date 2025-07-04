import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/api';
import { useAuth } from './AuthContext';

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Загрузка корзины
    const loadBasket = useCallback(async () => {
        if (!token) {
            setItems([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.goods.getCart(token);

            // Преобразуем данные API в формат, ожидаемый фронтендом
            const formattedItems = response.map(item => ({
                id: item.goods.id,
                goods: {
                    id: item.goods.id,
                    title: item.goods.title,
                    price: item.goods.price,
                    images: item.goods.images,
                    // Другие необходимые поля товара
                },
                quantity: item.count,
                price: item.price
            }));

            setItems(formattedItems);
            setLastUpdated(new Date());
        } catch (err) {
            console.error('Ошибка загрузки корзины:', err);
            setError('Не удалось загрузить корзину');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Автоматическая загрузка корзины при изменении токена или после обновления
    useEffect(() => {
        loadBasket();
    }, [loadBasket]);

    // Добавление товара в корзину
    const addItem = useCallback(async (itemId, count) => {
        if (!token) {
            throw new Error('Для добавления в корзину требуется авторизация');
        }

        try {
            await api.goods.addToCart(itemId, token, count);
            await loadBasket();
        } catch (err) {
            console.error('Ошибка добавления в корзину:', err);
            throw new Error(err.response?.data?.error || 'Не удалось добавить товар в корзину');
        }
    }, [token, loadBasket]);

    // Удаление товара из корзины
    const removeItem = useCallback(async (itemId) => {
        if (!token) return;

        try {
            await api.goods.removeFromCart(itemId, token);
            await loadBasket();
        } catch (err) {
            console.error('Ошибка удаления из корзины:', err);
            throw new Error('Не удалось удалить товар из корзины');
        }
    }, [token, loadBasket]);

    // Обновление количества товара
    const updateItem = useCallback(async (itemId, newQuantity) => {
        if (!token) return;
        if (newQuantity < 1) {
            await removeItem(itemId);
            return;
        }

        try {
            await api.goods.updateCartItem(itemId, newQuantity, token);
            await loadBasket();
        } catch (err) {
            console.error('Ошибка обновления количества:', err);
            throw new Error(err.response?.data?.error || 'Не удалось изменить количество товара');
        }
    }, [token, loadBasket, removeItem]);

    // Очистка корзины
    const clearBasket = useCallback(async () => {
        if (!token) return;

        try {
            // Удаляем каждый товар по отдельности, так как API не предоставляет массового удаления
            await Promise.all(items.map(item =>
                api.goods.removeFromCart(item.id, token)
            ));
            await loadBasket();
        } catch (err) {
            console.error('Ошибка очистки корзины:', err);
            throw new Error('Не удалось очистить корзину');
        }
    }, [token, items, loadBasket]);

    // Создание заказа
    const createOrder = useCallback(async (orderData) => {
        if (!token) {
            throw new Error('Для оформления заказа требуется авторизация');
        }

        try {
            // Подготавливаем данные для API
            const apiOrderData = {
                ...orderData,
                // Дополнительные преобразования данных при необходимости
            };

            const response = await api.goods.createOrder(apiOrderData, token);
            await loadBasket(); // Обновляем корзину после создания заказа
            return response.data;
        } catch (err) {
            console.error('Ошибка создания заказа:', err);
            throw new Error(err.response?.data?.error || 'Не удалось оформить заказ');
        }
    }, [token, loadBasket]);

    // Получение истории заказов
    const getOrderHistory = useCallback(async () => {
        if (!token) return [];

        try {
            const response = await api.goods.getOrderHistory(token);
            // Преобразуем данные API в формат, ожидаемый фронтендом
            return response.data.map(order => ({
                id: order.id,
                date: order.order_date,
                total: order.total_price,
                status: 'completed', // Добавляем статус, если API его не предоставляет
                items: order.items.map(item => ({
                    id: item.goods.id,
                    title: item.goods.title,
                    quantity: item.count,
                    price: item.price
                }))
            }));
        } catch (err) {
            console.error('Ошибка получения истории заказов:', err);
            throw new Error('Не удалось загрузить историю заказов');
        }
    }, [token]);

    // Вычисляемые значения
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const contextValue = {
        items,
        loading,
        error,
        lastUpdated,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateItem,
        clearBasket,
        createOrder,
        getOrderHistory,
        refreshBasket: loadBasket
    };

    return (
        <BasketContext.Provider value={contextValue}>
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasket must be used within a BasketProvider');
    }
    return context;
};