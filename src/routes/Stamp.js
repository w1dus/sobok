import Header from 'components/Header';
import Navigation from 'components/Navigation';
import React, { useState } from 'react'; 
import { Link } from 'react-router-dom';
import styles from"./Stamp.module.css";
import axios from 'axios';
import  { useEffect } from 'react';



function Li(data){
    let arr = [];
    let arrStampId = [];
    for (let i = 0; i < data.length; i++) {
        if(i>8){continue;}
        arrStampId.push(data[i].stampId);
        arr.push(
        <li className={styles.on}>
            <div className={styles.itemBox}>
                <div className={styles.itemIcon}></div>
                <p className={styles.title}>{data[i].store}</p>
                <p className={styles.date}>{data[i].time}</p>
            </div>
        </li>
        )
      }

      return (
        <>
        <ul className={styles.stampList}>
            {arr}
        </ul>
        {data.length>=9 ? 
        <div className={styles.btnWrap}>
            <Link to="/check_cupon" state={{ arrStampId: arrStampId }}>
                <button className={styles.okBtn}>쿠폰 확인하기</button>
            </Link>
        </div>
        :""}
        </>
      );
}

function Stamp(userObj){
    const [status, setStatus] = useState("경희대학교");
    userObj=userObj.userObj;
    console.log(userObj.email);

    //data
    const [data, setData] = useState(false);
    useEffect(() => {
        axios.get(`https://sobok.gabia.io/api/read?userId=${userObj.email}`).then((Response)=>{
            setData(Response.data.results);
        }).catch((Error)=>{
            console.log(Error)
        });
      },[]);
    return (
        <>
           <Header title="스템프 적립"/>
           <div className={styles.stampContainer}>
                <div className={styles.storeTitle}>
                    {(status === "경희대학교") ? <div className={styles.logo}  style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images//khu_logo.png)`}} ></div>  : null }
                    {status} 카페 투어 스탬프 
                </div>
                <ul className={styles.cafeList}>
                    <li className={(status === "경희대학교") ? styles.on : null} onClick={() => setStatus("경희대학교")}>경희대학교</li>
                    {/* <li>동대문구</li> */}
                </ul>
                {Li(data)}
                
           </div>
           <Navigation />
        </>
    );
}

export default  Stamp;