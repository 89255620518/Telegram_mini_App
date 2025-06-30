import { useState, useRef, useEffect } from 'react';
import MenuCard from './menuCard';
import styles from './menu.module.scss';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const menuItems = [
    { id: 1, title: 'Новый бургер', description: 'Сочная говядина с сыром', weight: 150, price: 350, image: '/burger.jpg', category: 'Бургеры' },
    { id: 2, title: 'Салат Цезарь', description: 'С курицей и пармезаном', weight: 150, price: 280, image: '/salad.jpg', category: 'Салаты' },
    { id: 3, title: 'Пицца Пепперони', description: 'Острая и ароматная', weight: 150, price: 450, image: '/pizza.jpg', category: 'Пицца' },
    { id: 4, title: 'Десерт Тирамису', description: 'Нежный итальянский десерт', weight: 150, price: 220, image: '/tiramisu.jpg', category: 'Десерты' },
    { id: 5, title: 'Лазанья', description: 'С мясной начинкой', weight: 150, price: 320, image: '/lasagna.jpg', category: 'Основные блюда' },
    { id: 6, title: 'Стейк', description: 'Из мраморной говядины', weight: 150, price: 590, image: '/steak.jpg', category: 'Основные блюда' },
    { id: 7, title: 'Мороженое', description: 'Ванильное с шоколадной крошкой', weight: 150, price: 320, image: '/icecream.jpg', category: 'Десерты' },
    { id: 8, title: 'Кола', description: 'Освежающий напиток', weight: 150, price: 590, image: '/cola.jpg', category: 'Напитки' }
];

const MenuComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Все');
    const carouselRef = useRef(null);
    const animationRef = useRef(null);

    // Получаем уникальные категории
    const categories = ['Все', ...new Set(menuItems.map(item => item.category))];

    // Фильтруем товары по выбранной категории
    const filteredItems = activeCategory === 'Все'
        ? menuItems
        : menuItems.filter(item => item.category === activeCategory);

    useEffect(() => {
        const updateCardsPerView = () => {
            if (window.innerWidth < 768) {
                setCardsPerView(1);
            } else if (window.innerWidth < 1024) {
                setCardsPerView(2);
            } else {
                setCardsPerView(3);
            }
        };

        updateCardsPerView();
        window.addEventListener('resize', updateCardsPerView);
        return () => window.removeEventListener('resize', updateCardsPerView);
    }, []);

    useEffect(() => {
        // Сбрасываем индекс при смене категории
        setCurrentIndex(0);
    }, [activeCategory]);

    const nextSlide = () => {
        if (currentIndex >= filteredItems.length - cardsPerView) return;
        cancelAnimationFrame(animationRef.current);
        setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentIndex <= 0) return;
        cancelAnimationFrame(animationRef.current);
        setCurrentIndex(prev => prev - 1);
    };

    const handleTouchStart = (e) => {
        if (window.innerWidth >= 768) return;
        setTouchStart(e.targetTouches[0].clientX);
        setTouchEnd(e.targetTouches[0].clientX);
        setIsDragging(true);
        cancelAnimationFrame(animationRef.current);
    };

    const handleTouchMove = (e) => {
        if (!isDragging || window.innerWidth >= 768) return;
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (window.innerWidth >= 768) return;
        setIsDragging(false);

        const swipeDistance = touchEnd - touchStart;
        const threshold = 50;

        if (swipeDistance < -threshold && currentIndex < filteredItems.length - cardsPerView) {
            nextSlide();
        } else if (swipeDistance > threshold && currentIndex > 0) {
            prevSlide();
        } else {
            animateReset();
        }
    };

    const animateReset = () => {
        let start = null;
        const duration = 300;
        const startX = touchEnd - touchStart;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            const easePercentage = easeOutCubic(percentage);
            const currentX = startX * (1 - easePercentage);

            setTouchEnd(touchStart + currentX);

            if (progress < duration) {
                animationRef.current = requestAnimationFrame(step);
            } else {
                setTouchEnd(touchStart);
            }
        };

        animationRef.current = requestAnimationFrame(step);
    };

    const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 6);
    };

    const getOffset = () => {
        if (window.innerWidth >= 768) return 0;
        if (!isDragging) return 0;
        return touchEnd - touchStart;
    };

    const canGoNext = currentIndex < filteredItems.length - cardsPerView;
    const canGoPrev = currentIndex > 0;

    return (
        <div className={styles.containerSubMenu}>
            {/* <h1 className={styles.containerSubMenu__h1}>Меню</h1> */}

            {/* Добавляем переключатель категорий */}
            <div className={styles.categories}>
                {categories.map(category => (
                    <button
                        key={category}
                        className={`${styles.categoryButton} ${activeCategory === category ? styles.active : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}

                <div className={styles.containerSubMenu__line}></div>
            </div>

            <h2 className={styles.containerSubMenu__h1}>{activeCategory}</h2>


            <div className={styles.carouselContainer}>
                {canGoPrev && (
                    <button
                        className={`${styles.carouselButton} ${styles.carouselButtonPrev}`}
                        onClick={prevSlide}
                        aria-label="Предыдущий слайд"
                    >
                        <FaChevronLeft />
                    </button>
                )}

                <div
                    className={styles.carousel}
                    ref={carouselRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        className={styles.carouselTrack}
                        style={{
                            transform: `translateX(calc(-${currentIndex * (100 / cardsPerView)}% + ${getOffset()}px))`,
                            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className={styles.carouselItem}
                                style={{
                                    flex: `0 0 ${100 / cardsPerView}%`,
                                    padding: '0 60px',
                                }}
                            >
                                <MenuCard item={item} />
                            </div>
                        ))}
                    </div>
                </div>

                {canGoNext && (
                    <button
                        className={`${styles.carouselButton} ${styles.carouselButtonNext}`}
                        onClick={nextSlide}
                        aria-label="Следующий слайд"
                    >
                        <FaChevronRight />
                    </button>
                )}
            </div>

            <div className={styles.pagination}>
                {Array.from({ length: Math.ceil(filteredItems.length / cardsPerView) }).map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.paginationDot} ${index === Math.floor(currentIndex / cardsPerView) ? styles.active : ''
                            }`}
                        onClick={() => setCurrentIndex(index * cardsPerView)}
                        aria-label={`Перейти к слайду ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MenuComponent;