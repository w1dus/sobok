
import Header from 'components/Header';
import Navigation from 'components/Navigation';
import { dbService } from 'fbase';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Apply.module.css'; 
import axios from 'axios';



function Apply (userObj) {
    userObj=userObj.userObj;
    const [data, setData] = useState(false);
    
    function Li(data){
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr.push(
            <li>
                <div className={styles.item}>
                    <div className={styles.date}>{data[i].time}</div>
                    <div className={styles.contentBox}>
                        <p className={styles.title}>
                        적립보상 : 경희대학교 마스코트 인형
                        </p>
                        <div className={styles.box}>
                        <p className={styles.content} >
                        {(data[i].state==="1") ? "대기" : ""}
                        {(data[i].state==="2") ? "완료" : ""}
                        {(data[i].state==="3") ? "취소" : ""}
                        / {data[i].name} / {data[i].phone} / {data[i].addr} / {data[i].addr_text}

                        </p>
                        {(data[i].state==="1"||data[i].state==="3") ? 
                        <select onChange={State_change} data-id={data[i].applyId} data-stamp={data[i].stampId} className={styles.selectbox}>
                            {(data[i].state==="1") ? <option value="1" selected>대기</option> : <option value="1" >대기</option>}
                            {(data[i].state==="2") ? <option value="2" selected>완료</option> : <option value="2" >완료</option>}
                            {(data[i].state==="3") ? <option value="3" selected>취소</option> : <option value="3" >취소</option>}
                        </select>
                        :""}
                        </div>
                    </div>
                </div>
            </li>
            )
          }
    
          return arr;
    }
    
    const State_change = (event) => {

        
        let state =event.target.value;
        let applyId =event.target.dataset.id;
        let stamp =event.target.dataset.stamp;
        if(event.target.value=="2"){
            if (!window.confirm("완료하시겠습니까? 한 번 바꾼 상태는 되돌릴 수 없습니다.")) {return false;}
        }
        axios.put('https://sobok.gabia.io/api/update_apply', 
        {
            state : state,
            applyId : applyId,
            stamp : stamp,
        }
        ).then((Response)=>{
            axios.get(`https://sobok.gabia.io/api/read_apply_admin`).then((Response)=>{
                setData(Response.data.results);
            }).catch((Error)=>{
                console.log(Error)
            });
            alert('상태가 변경되었습니다.');
            window.location.reload();
            //update
            
        })
        .catch((Error)=>{
        console.log(Error)
        });
    }

    useEffect(() => {
        axios.get(`https://sobok.gabia.io/api/read_apply_admin`).then((Response)=>{
            setData(Response.data.results);
            console.log('z');
        }).catch((Error)=>{
            console.log(Error)
        });
      },[]);

      

      

    return (
        <>
            <Header title="신청내역"/>
            <div className={styles.eventContainer}>
                <ul className={styles.eventList}>
                    {Li(data)}
                </ul>
            </div>
            <Navigation />
        </>
    ) ;
}

export default Apply; 


