import styles from './delivery.module.scss';
import mobile from './img/delivery-mobile.png';

const DeliveryComponent = () => {

    return (
        <div className={styles.containerDelivery}>
            <h1 className={styles.containerDelivery__h1}>Доставка</h1>
            <div className={styles.containerDelivery__content}>
                <div className={styles.containerDelivery__content__imgs}>
                    <img className={styles.containerDelivery__content__imgs_img} src={mobile} alt='Мобильный Дали-Хинкали' />
                </div>

                <div className={styles.containerDelivery__content__infoButton}>
                    <h3 className={styles.containerDelivery__content__infoButton_text}>Закажи и следи за курьером в режиме Онлайн</h3>

                    <button className={styles.containerDelivery__content__infoButton_button}>Оформить заказ ДОСТАВКУ</button>
                </div>
            </div>
        </div>
    )
}

export default DeliveryComponent;