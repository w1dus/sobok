import Header from 'components/Header';
import Navigation from 'components/Navigation';
import { dbService } from 'fbase';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import styles from"./StampAccumulate.module.css";


function StampAccumulate({userObj}){

    let navigate = useNavigate();
    
    const [phoneNumber, setPhoneNumber] = useState("");    
    
    const getTelephone = async() => {
        
        const db_query = query( 
            collection(dbService, "user"),
            where("uid", "==" , userObj.uid),
            limit(1)
        )
            
        const telephone = await getDocs(db_query);
        if(!telephone.empty){
            telephone.forEach((document) => {
                setPhoneNumber(document.data().telephone)
            });
        }
    }
    
    useEffect(() => {
        getTelephone();
        
    } , [])

    return (
        <>
            <Header title="스템프 적립요청"/>
            <div className={styles.stampContainer}>
                <p className={styles.title}>스템프 적립</p>
                <img src={`${process.env.PUBLIC_URL}/images/sobok_logo_and_title.svg`} alt="소복 스탬프 적립 요청" className={styles.logo}/>
                {(phoneNumber || phoneNumber === "") ? 
                    <p className={styles.phoneNumber}>{phoneNumber.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)}</p>
                    :
                    <p className={styles.help}>[my]➡️[회원정보수정]에서 연락처를 등록해주세요.</p>
                }
                <p className={styles.help}> {userObj.email}   카페 직원분에게 해당 아이디를 보여주세요.z</p>

                <div className={styles.btnWrap}>
                    <button className={styles.okBtn} onClick={() => {navigate(-1)}}>확인</button>
                </div>
            </div>
            <Navigation />
        </>
    );
}

export default  StampAccumulate;