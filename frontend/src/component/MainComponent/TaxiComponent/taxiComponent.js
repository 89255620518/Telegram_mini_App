import styles from './taxiComponent.module.scss';
import taxiFoto from './img/taxi.jpg';

const TaxiComponent = ({ taxiRef }) => {

    return (
        <div className={styles.containerTaxi} ref={taxiRef}>
            <h1 className={styles.containerTaxi__h1}>Такси до дома</h1>
            <div className={styles.containerTaxi__content}>
                <div className={styles.containerTaxi__content__imgs}>
                    <img
                        className={styles.containerTaxi__content__imgs_img}
                        src={taxiFoto}
                        alt='Такси Дали-Хинкали'
                    />
                </div>

                <div className={styles.containerTaxi__content__infoButton}>
                    <p className={styles.containerTaxi__content__infoButton_text}>Бесплатная доставка еды из кафе Дали-Хинкали по Орехово-Зуевскому району, а так же у нас существует услуга такси до дома</p>

                    <button className={styles.containerTaxi__content__infoButton_button}>Предзаказ</button>
                </div>
            </div>
        </div>
    )
}

export default TaxiComponent;