import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../api/api';
import { useAuth } from './AuthContext';

const BasketContext = createContext();

export const BasketProvider = ({ children }) => {
    const { token } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка корзины (стабильная ссылка при неизменном token)
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

            const formattedItems = response.map(item => ({
                id: item.goods.id,
                goods: {
                    id: item.goods.id,
                    title: item.goods.title,
                    price: item.goods.price,
                    images: item.goods.images,
                },
                quantity: item.count,
                price: item.price
            }));

            setItems(formattedItems);
        } catch (err) {
            console.error('Ошибка загрузки корзины:', err);
            setError('Не удалось загрузить корзину');
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Загружаем корзину только при изменении токена
    useEffect(() => {
        loadBasket();
    }, [loadBasket]);

    // Добавление товара (стабильная ссылка)
    const addItem = useCallback(async (itemId, count = 1) => {
        if (!token) throw new Error('Требуется авторизация');
        try {
            await api.goods.addToCart(itemId, token, count);
            await loadBasket();
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Ошибка добавления');
        }
    }, [token, loadBasket]);

    // Удаление товара (стабильная ссылка)
    const removeItem = useCallback(async (itemId) => {
        if (!token) return;
        try {
            await api.goods.removeFromCart(itemId, token);
            await loadBasket();
        } catch (err) {
            throw new Error('Ошибка удаления');
        }
    }, [token, loadBasket]);

    // Обновление количества (стабильная ссылка)
    const updateItem = useCallback(async (itemId, newQuantity) => {
        if (!token) return;
        try {
            await api.goods.updateCartItem(itemId, newQuantity, token);
            await loadBasket();
        } catch (err) {
            throw new Error('Ошибка обновления');
        }
    }, [token, loadBasket]);

    // Очистка корзины (без зависимости от items)
    const clearBasket = useCallback(async () => {
        if (!token) return;
        try {
            const currentItems = [...items];
            await Promise.all(currentItems.map(item =>
                api.goods.removeFromCart(item.id, token)
            ));
            await loadBasket();
        } catch (err) {
            throw new Error('Ошибка очистки');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, items, loadBasket]);

    // Вычисляемые значения
    const totalItems = useMemo(() =>
        items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const totalPrice = useMemo(() =>
        items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [items]
    );

    // Мемоизированный контекст
    const contextValue = useMemo(() => ({
        items,
        loading,
        error,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateItem,
        clearBasket,
        refreshBasket: loadBasket
    }), [
        items,
        loading,
        error,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateItem,
        clearBasket,
        loadBasket
    ]);

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