import styles from './reserveTable.module.scss';
import { useState, useEffect, useCallback } from 'react';
import Zal from './Zal/zal';
import Veranda from './Veranda/veranda';

const ReserveTable = () => {
    const [currentModal, setCurrentModal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        hall: '',
        table: '', // Добавлено поле для хранения выбранного стола
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        guests: '',
        comments: ''
    });

    const [errors, setErrors] = useState({
        hall: '',
        table: '', // Добавлена валидация для стола
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '',
        guests: ''
    });

    const [touched, setTouched] = useState({
        hall: false,
        table: false,
        date: false,
        time: false,
        name: false,
        phone: false,
        email: false,
        guests: false
    });

    // Обработчик выбора стола из модального окна
    const handleTableSelect = useCallback((tableNumber) => {
        setFormData(prev => ({
            ...prev,
            table: tableNumber
        }));
        setTouched(prev => ({
            ...prev,
            table: true
        }));
    }, []);

    // Валидация полей
    const validateField = (name, value) => {
        switch (name) {
            case 'hall':
                return value !== '' ? '' : 'Пожалуйста, выберите зал';
            case 'table':
                return value !== '' ? '' : 'Пожалуйста, выберите стол';
            case 'date':
                if (value === '') return 'Пожалуйста, выберите дату';
                if (new Date(value) < new Date(new Date().setHours(0, 0, 0, 0))) {
                    return 'Дата не может быть в прошлом';
                }
                return '';
            case 'time':
                if (value === '') return 'Пожалуйста, выберите время';
                const [hours, minutes] = value.split(':').map(Number);
                const totalMinutes = hours * 60 + minutes;
                if (totalMinutes >= 22 * 60 || totalMinutes < 11 * 60) {
                    return 'Заведение не работает в это время (Можно забронировать с 11:00 до 22:00)';
                }
                return '';
            case 'name':
                return value.trim().length >= 2 ? '' : 'Имя должно содержать минимум 2 символа';
            case 'email':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Пожалуйста, введите корректный email';
            case 'phone':
                return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value)
                    ? ''
                    : 'Пожалуйста, введите корректный телефон';
            case 'guests':
                if (value === '') return 'Пожалуйста, укажите количество гостей';
                const num = Number(value);
                return !isNaN(num) && num >= 1 && num <= 30
                    ? ''
                    : 'Пожалуйста, введите число от 1 до 30';
            default:
                return '';
        }
    };

    // Проверка всех полей при изменении
    useEffect(() => {
        const newErrors = { ...errors };
        let key;
        for (key in formData) {
            if (key in errors) {
                newErrors[key] = validateField(key, formData[key]);
            }
        }
        setErrors(newErrors);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'hall') {
            // Сбрасываем выбор стола при смене зала
            setFormData(prev => ({ ...prev, table: '' }));

            if (value === 'Основной зал') {
                setCurrentModal('zal');
                setIsModalOpen(true);
            } else if (value === 'Веранда') {
                setCurrentModal('veranda');
                setIsModalOpen(true);
            } else {
                setIsModalOpen(false);
                setCurrentModal(null);
            }
        }
    };

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setCurrentModal(null);
    }, []);

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Проверяем, есть ли ошибки
        const hasErrors = Object.values(errors).some(error => error !== '');

        if (!hasErrors) {
            console.log('Форма отправлена:', formData);
            // Здесь будет логика отправки формы
        } else {
            console.log('Форма содержит ошибки');
            // Помечаем все поля как touched для показа ошибок
            setTouched({
                hall: true,
                table: true,
                date: true,
                time: true,
                name: true,
                email: true,
                phone: true,
                guests: true
            });
        }
    };

    // Функция для определения класса поля
    const getFieldClass = (fieldName) => {
        if (!touched[fieldName]) return styles.input;
        return errors[fieldName] ? styles.inputError : styles.inputValid;
    };

    return (
        <div className={styles.containerReserveTable}>
            <h1 className={styles.title}>Резерв стола</h1>
            <div className={styles.content}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="hall" className={styles.label}>Зал / Веранда: *</label>
                        <select
                            id="hall"
                            name="hall"
                            value={formData.hall}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getFieldClass('hall')}
                            required
                        >
                            <option value="">Выберите</option>
                            <option value="Основной зал">Зал</option>
                            <option value="Веранда">Веранда</option>
                        </select>
                        {touched.hall && errors.hall && (
                            <span className={styles.errorMessage}>{errors.hall}</span>
                        )}
                    </div>

                    {/* Поле для отображения выбранного стола */}
                    {formData.hall && (
                        <div className={styles.formGroup}>
                            <label htmlFor="table" className={styles.label}>Выбранный стол: *</label>
                            <input
                                type="text"
                                id="table"
                                name="table"
                                value={formData.table ? `Стол №${formData.table}` : ''}
                                readOnly
                                onClick={() => {
                                    if (formData.hall === 'Основной зал') {
                                        setCurrentModal('zal');
                                        setIsModalOpen(true);
                                    } else if (formData.hall === 'Веранда') {
                                        setCurrentModal('veranda');
                                        setIsModalOpen(true);
                                    }
                                }}
                                onBlur={handleBlur}
                                className={getFieldClass('table')}
                                required
                            />
                            {touched.table && errors.table && (
                                <span className={styles.errorMessage}>{errors.table}</span>
                            )}
                        </div>
                    )}

                    <div className={styles.row}>
                        <div className={`${styles.formGroup} ${styles.half}`}>
                            <label htmlFor="date" className={styles.label}>Дата: *</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getFieldClass('date')}
                                required
                            />
                            {touched.date && errors.date && (
                                <span className={styles.errorMessage}>{errors.date}</span>
                            )}
                        </div>
                        <div className={`${styles.formGroup} ${styles.half}`}>
                            <label htmlFor="time" className={styles.label}>Время: *</label>
                            <input
                                type="time"
                                id="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={getFieldClass('time')}
                                required
                                min="11:00"
                                max="22:00"
                            />
                            {touched.time && errors.time && (
                                <span className={styles.errorMessage}>{errors.time}</span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>Имя: *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getFieldClass('name')}
                            required
                            minLength={2}
                        />
                        {touched.name && errors.name && (
                            <span className={styles.errorMessage}>{errors.name}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Почта: *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getFieldClass('email')}
                            required
                        />
                        {touched.email && errors.email && (
                            <span className={styles.errorMessage}>{errors.email}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>Телефон: *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getFieldClass('phone')}
                            required
                            placeholder="+7 (XXX) XXX-XX-XX"
                        />
                        {touched.phone && errors.phone && (
                            <span className={styles.errorMessage}>{errors.phone}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="guests" className={styles.label}>Число гостей (1-30): *</label>
                        <input
                            type="number"
                            id="guests"
                            name="guests"
                            min="1"
                            max="30"
                            value={formData.guests}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={getFieldClass('guests')}
                            required
                        />
                        {touched.guests && errors.guests && (
                            <span className={styles.errorMessage}>{errors.guests}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="comments" className={styles.label}>Комментарии:</label>
                        <textarea
                            id="comments"
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>Забронировать</button>
                </form>
            </div>

            {/* Модальные окна для выбора столов */}
            {isModalOpen && currentModal === 'zal' && (
                <Zal closeModal={closeModal} handler={handleTableSelect} />
            )}

            {isModalOpen && currentModal === 'veranda' && (
                <Veranda closeModal={closeModal} handler={handleTableSelect} />
            )}
        </div>
    )
}

export default ReserveTable;