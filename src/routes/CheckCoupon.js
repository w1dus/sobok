import Header from 'components/Header';
import Navigation from 'components/Navigation';
import React from 'react'; 
import { Link } from 'react-router-dom';
import styles from"./CheckCoupon.module.css";
import { useLocation } from 'react-router-dom';
function CheckCoupon(stte){
    return (
        <>
           <Header title="쿠폰확인"/>
           <div className={styles.cuponContainer}>
                <div className={styles.storeTitle}>
                    <div class={styles.logo} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images//khu_logo.png)`}}></div> {/* 로고는 있을 시에만 background-image로 등록 */}
                    경희대학교 카페 투어 스탬프 
                </div>
                <div class={styles.cuponWrap}>
                    <img src={`${process.env.PUBLIC_URL}/images/stamp_product.png`} alt="경희대학교 투어 스탬프 상품" className={styles.stampProduct} />
                    <p className={styles.title}>적립보상 : 경희대학교 마스코트 인형</p>
                    <p className={styles.cupon}>보유 : 1장</p>
                </div>
                <div className={styles.btnWrap}>
                    <Link to="/shipping" state={{ arrStampId: useLocation().state.arrStampId }}>
                        <button className={styles.okBtn}>사용 요청하기</button>
                    </Link>
                </div>
           </div>
           <Navigation />
        </>
    );
}

export default  CheckCoupon;