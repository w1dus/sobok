import Header from 'components/Header';
import Navigation from 'components/Navigation';
import React from 'react'; 
import styles from"./StampIssued.module.css";
import axios from 'axios';

function Stamp_add(){
    let userId = document.getElementById('userId');
    let store = document.getElementById('store');
    axios.post('https://sobok.gabia.io/api/create', 
            {
                userId : userId.value,
                store : store.value

            }
    ).then((Response)=>{
        console.log(Response);
        alert('등록되었습니다.');
    })
    .catch((Error)=>{
        console.log(Error)
    });
}

function StampIssued(){
    return (
        <>
           <Header title="스템프 적립요청"/>
            <div className={styles.stampContainer}>
                <p className={styles.title}>스템프 적립</p>
                <img src={`${process.env.PUBLIC_URL}/images/sobok_logo_and_title.svg`} alt="소복 스탬프 적립 요청" className={styles.logo}/>
                <p className={styles.help}>회원님의 번호와 적립개수를 입력해주세요.</p>

                <label className={styles.label}>아이디<b>*</b></label>
                <div className={styles.iptWrap}>
                    <input id="userId"type="text" placeholder="아이디" className={styles.iptWrap}/>
                </div>
                <label className={styles.label}>매장<b>*</b></label>
                <div className={styles.iptWrap}>
                    <input id="store" type="text" placeholder="매장" className={styles.iptWrap}/>
                </div>
                <div className={styles.btnWrap}>
                    <button onClick={Stamp_add} className={styles.okBtn}>적립하기</button>
                </div>
            </div>
            <Navigation />
        </>
    );
}

export default  StampIssued;