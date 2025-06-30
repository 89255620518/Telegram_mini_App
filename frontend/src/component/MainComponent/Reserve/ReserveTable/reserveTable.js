import styles from './reserveTable.module.scss';
import { useState, useEffect, useCallback } from 'react';
import Zal from './Zal/zal';
import Veranda from './Veranda/veranda';
import ReserveModal from '../ReserveModal/reserveModal';

const ReserveTable = ({ tableRef }) => {
    const [currentModal, setCurrentModal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        hall: '',
        table: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '+7',
        guests: '',
        comments: ''
    });

    const [errors, setErrors] = useState({
        hall: '',
        table: '',
        date: '',
        time: '',
        name: '',
        email: '',
        phone: '+7',
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

    const handlePhoneChange = useCallback((value) => {
        let cleaned = value.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+7')) {
            cleaned = '+7' + cleaned.replace(/^\+/, '');
        }
        if (cleaned.length > 12) {
            cleaned = cleaned.substring(0, 12);
        }
        return cleaned;
    }, []);

    const formatPhoneDisplay = useCallback((phone) => {
        if (!phone) return '+7';
        const digits = phone.replace(/\D/g, '').substring(1);
        if (digits.length === 0) return '+7';
        if (digits.length <= 3) return `+7 (${digits}`;
        if (digits.length <= 6) return `+7 (${digits.substring(0, 3)}) ${digits.substring(3)}`;
        if (digits.length <= 8) return `+7 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
        return `+7 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 8)}-${digits.substring(8, 10)}`;
    }, []);

    const validatePhone = useCallback((phone) => {
        if (!phone) return 'Пожалуйста, введите телефон';
        if (phone.length < 12) return 'Некорректный номер телефона';
        return '';
    }, []);

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
                return validatePhone(value);
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

    useEffect(() => {
        const newErrors = { ...errors };
        let key;
        for (key in formData) {
            if (key in errors) {
                newErrors[key] = validateField(key, formData[key]);
            }
        }
        setErrors(newErrors);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const formattedPhone = handlePhoneChange(value);
            setFormData(prev => ({
                ...prev,
                [name]: formattedPhone
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (name === 'hall') {
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

    const resetForm = useCallback(() => {
        setFormData({
            hall: '',
            table: '',
            date: '',
            time: '',
            name: '',
            email: '',
            phone: '+7',
            guests: '',
            comments: ''
        });
        setTouched({
            hall: false,
            table: false,
            date: false,
            time: false,
            name: false,
            phone: false,
            email: false,
            guests: false
        });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Проверка всех полей перед отправкой
        const newTouched = {};
        Object.keys(touched).forEach(key => {
            newTouched[key] = true;
        });
        setTouched(newTouched);

        const hasErrors = Object.values(errors).some(error => error !== '');
        if (hasErrors) {
            setIsSubmitting(false);
            return;
        }

        try {
            // Здесь должна быть логика отправки данных на сервер
            console.log('Форма отправлена:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsSuccess(true);
            resetForm();

            // Автоматическое закрытие уведомления через 3 секунды
            setTimeout(() => {
                setIsSuccess(false);
            }, 3000);
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getFieldClass = (fieldName) => {
        if (!touched[fieldName]) return styles.input;
        return errors[fieldName] ? styles.inputError : styles.inputValid;
    };

    return (
        <div className={styles.containerReserveTable} ref={tableRef}>
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
                            value={formatPhoneDisplay(formData.phone)}
                            onChange={handleChange}
                            onBlur={(e) => {
                                handleBlur(e);
                                // Дополнительная валидация при потере фокуса
                                if (formData.phone.length < 12) {
                                    setErrors(prev => ({
                                        ...prev,
                                        phone: 'Введите корректный номер телефона (+7 XXX XXX XX XX)'
                                    }));
                                }
                            }}
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

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Отправка...' : 'Забронировать'}
                    </button>
                </form>
            </div>

            {/* Модальные окна для выбора столов */}
            {isModalOpen && currentModal === 'zal' && (
                <Zal closeModal={closeModal} handler={handleTableSelect} />
            )}

            {isModalOpen && currentModal === 'veranda' && (
                <Veranda closeModal={closeModal} handler={handleTableSelect} />
            )}

            {isSuccess && <ReserveModal />}
        </div>
    )
}

export default ReserveTable;