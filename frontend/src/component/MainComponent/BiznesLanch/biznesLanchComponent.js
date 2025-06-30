import styles from './biznesLanch.module.scss';
import MenuCard from '../../MenuComponent/menuCard'
import biznesFon from '../Banner/img/biznes.jpg';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const menuItems = [
    { id: 1, title: 'Новый бургер', description: 'Сочная говядина с сыром', weight: 150, price: 350, image: '/burger.jpg' },
    { id: 2, title: 'Салат Цезарь', description: 'С курицей и пармезаном', weight: 150, price: 280, image: '/salad.jpg' },
    { id: 3, title: 'Пицца Пепперони', description: 'Острая и ароматная', weight: 150, price: 450, image: '/pizza.jpg' },
    { id: 4, title: 'Десерт Тирамису', description: 'Нежный итальянский десерт', weight: 150, price: 220, image: '/tiramisu.jpg' },
    { id: 5, title: 'Лазанья', description: 'С мясной начинкой', weight: 150, price: 320, image: '/lasagna.jpg' },
    { id: 6, title: 'Стейк', description: 'Из мраморной говядины', weight: 150, price: 590, image: '/steak.jpg' },
    { id: 7, title: 'Морженое', description: 'С мясной начинкой', weight: 150, price: 320, image: '/lasagna.jpg' },
    { id: 8, title: 'Кола', description: 'Из мраморной говядины', weight: 150, price: 590, image: '/steak.jpg' }
];

const BiznesLanchComponent = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(3);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const carouselRef = useRef(null);
    const animationRef = useRef(null);

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

    const nextSlide = () => {
        if (currentIndex >= menuItems.length - cardsPerView) return;
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

        if (swipeDistance < -threshold && currentIndex < menuItems.length - cardsPerView) {
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

    const canGoNext = currentIndex < menuItems.length - cardsPerView;
    const canGoPrev = currentIndex > 0;

    return (
        <div className={styles.containerBiznes}>
            <div className={styles.containerBiznes__content}>
                <div className={styles.containerBiznes__content__info}>
                    <img
                        className={styles.containerBiznes__content__info_img}
                        src={biznesFon}
                        alt='Бизнес-Ланч Дали-Хинкали'
                    />

                    <p className={styles.containerBiznes__content__info_text}>Ежедневно<span className={styles.containerBiznes__content__info_text_span}>с 11:30 до 16:00</span></p>
                </div>

                <div className={styles.containerBiznes__content__menu}>
                    <h1 className={styles.containerBiznes__content__menu__h1}>Бизнес-Ланч</h1>

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
                                {menuItems.map((item, index) => (
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
                        {Array.from({ length: Math.ceil(menuItems.length / cardsPerView) }).map((_, index) => (
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
            </div>
        </div>
    )
}

export default BiznesLanchComponent;