import { Helmet } from "react-helmet";
import BannerComponent from "../component/MainComponent/Banner/banner";
import SubMenuComponent from "../component/MainComponent/SubMenu/subMenu";
import ReserveTable from "../component/MainComponent/Reserve/ReserveTable/reserveTable";
import DeliveryComponent from "../component/MainComponent/Delivery/deliveryComponent";
import DeliveryRulesComponent from "../component/MainComponent/DeliveryRules/deliveryRules";

const HomePage = () => {

    return (
        <div style={{ background: "#ffffff" }}>
            <Helmet>
                <title>Дали-Хинкали кафе грузинской кухни с летней верандой</title>
                <meta name="description" content="В Дали-Хинкали бесплатная доставка по Орехово-Зуевскому району" />
                <meta name="yandex-verification" content="c2e397d2d61662dc" />
            </Helmet>
            <BannerComponent />
            <SubMenuComponent />
            <ReserveTable />
            <DeliveryComponent />
            <DeliveryRulesComponent />
        </div>
    )
}

export default HomePage;