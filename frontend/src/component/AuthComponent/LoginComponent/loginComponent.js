import styles from './login.module.scss';
import { useState, useCallback } from 'react';
import fotoGif from '../img/font.gif';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginComponent = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const validate = useCallback(() => {
        const newErrors = {
            email: '',
            password: ''
        };

        if (!formData.email.trim()) {
            newErrors.email = 'Почта обязательна';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Некорректный формат почты';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).every(key => !newErrors[key]);
    }, [formData.email, formData.password]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: name === 'email'
                    ? !value.trim()
                        ? 'Почта обязательна'
                        : !/\S+@\S+\.\S+/.test(value)
                            ? 'Некорректный формат почты'
                            : ''
                    : !value
                        ? 'Пароль обязателен'
                        : value.length < 6
                            ? 'Пароль должен быть не менее 6 символов'
                            : ''
            }));
        }
    }, [touched]);

    const handleBlur = useCallback((e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validate();
    }, [validate]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setTouched({
            email: true,
            password: true
        });

        if (validate()) {
            console.log('Авторизация:', formData);
            // Здесь можно добавить вызов API для авторизации
        }
    }, [formData, validate]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getInputClass = (fieldName) => {
        return `${styles.input} ${touched[fieldName] && errors[fieldName]
                ? styles.errorInput
                : touched[fieldName]
                    ? styles.validInput
                    : ''
            }`;
    };

    return (
        <div className={styles.containerLogin}>
            <img className={styles.backgroundImage} src={fotoGif} alt='Фон авторизации' />

            <div className={styles.loginCard}>
                <h2 className={styles.title}>Авторизация</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Почта</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={getInputClass('email')}
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder="example@mail.com"
                        />
                        {touched.email && errors.email && (
                            <span className={styles.errorText}>{errors.email}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>Пароль</label>
                        <div className={styles.passwordInputContainer}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                className={getInputClass('password')}
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Не менее 6 символов"
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={togglePasswordVisibility}
                                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {touched.password && errors.password && (
                            <span className={styles.errorText}>{errors.password}</span>
                        )}
                    </div>

                    <div className={styles.infoAuth}>
                        <p className={styles.infoAuth_text}>Еще нет аккаунта?</p>
                        <Link to='/register' className={styles.registerLink}>Зарегистрируйтесь</Link>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={Object.values(errors).some(Boolean) && Object.values(touched).every(Boolean)}
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;