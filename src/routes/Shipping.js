import Header from 'components/Header';
import Navigation from 'components/Navigation';
import React from 'react'; 
import styles from"./Shipping.module.css";
import { useLocation } from 'react-router-dom';
import axios from 'axios';


function Stamp_apply_add(){
    let userId = document.getElementById('userId');
    let name = document.getElementById('name');
    let phone = document.getElementById('phone');
    let addr = document.getElementById('addr');
    let addr_text = document.getElementById('addr_text');
    let stampId = document.getElementById('stampId');
    axios.post('https://sobok.gabia.io/api/create_apply', 
            {
                userId : userId.value,
                name : name.value,
                phone : phone.value,
                addr : addr.value,
                addr_text : addr_text.value,
                stampId : stampId.value
            }
    ).then((Response)=>{
        console.log(Response);
        alert('등록되었습니다.');
        window.location.href = '/sobok';
    })
    .catch((Error)=>{
        console.log(Error)
    });
}

function Shipping(userObj){
    userObj=userObj.userObj;
    console.log(userObj);
    let stampId = useLocation().state.arrStampId.join(',');
    return (
        <>
           <Header title="마이페이지"/>
           <div className={styles.shippingContainer}>
                <p className={styles.title}>굿즈 수령을 요청하였습니다.</p>
                <p className={styles.help}>수령 받으실 정보를 입력해주세요.</p>
                <input 
                    type="hidden" 
                    id="stampId" 
                    value={stampId}
                />
                <input 
                    type="hidden" 
                    id="userId" 
                    value={userObj.email}
                />
                <div className={styles.ipt_wrap}>
                    <p className={styles.label}>이름<b>*</b></p>
                    <p>
                        <input
                            id="name"
                            type="text"
                            placeholder="배송받으실 분을 입력해주세요."
                            className={styles.ipt}
                            required
                        />
                    </p>
                </div>
                <div className={styles.ipt_wrap}>
                    <p className={styles.label}>연락처<b>*</b></p>
                    <p>
                        <input 
                            id="phone"
                            type="text"
                            placeholder="배송받으실분의 연락처를 입력해주세요."
                            className={styles.ipt}
                            required
                        />
                    </p>
                </div>
                <div className={styles.ipt_wrap}>
                    <p className={styles.label}>주소<b>*</b></p>
                    <p>
                        <input 
                            id="addr"
                            type="text"
                            placeholder="상세주소를 입력해주세요."
                            className={styles.ipt}
                            required
                        />
                    </p>
                </div>
                <div className={styles.ipt_wrap}>
                    <p className={styles.label}>상세주소<b>*</b></p>
                    <p>
                        <input 
                            id="addr_text"
                            type="text"
                            placeholder="상세주소를 입력해주세요."
                            className={styles.ipt}
                            required
                        />
                    </p>
                </div>
                {/* <div className={styles.ipt_wrap}>
                    <p className={styles.label}>배송메세지</p>
                    <p>
                        <input 
                            type="text"
                            placeholder="배송메세지를 입력해주세요."
                            className={styles.ipt}
                            required
                        />
                    </p>
                </div> */}
                <div className={styles.btnWrap}>
                    <button onClick={Stamp_apply_add} className={styles.okBtn}>입력완료</button>
                </div>
           </div>
           <Navigation />
        </>
    );
}

export default  Shipping;