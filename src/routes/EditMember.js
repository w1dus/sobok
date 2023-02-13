import React, { useEffect, useState } from 'react'; 
import Header from 'components/Header';
import Navigation from 'components/Navigation';

import styles from './EditMember.module.css';
import styled from 'styled-components';

import { useNavigate } from "react-router";
import { authService, dbService } from 'fbase';

import { addDoc, collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore"; 

import { updateProfile } from 'firebase/auth';
import { Link } from 'react-router-dom';


/* 비밀번호 변경 개발 필요 */

const List = styled.div`
    /* 마이페이지 리스트 */
    border-top: ${props => props.bordertop ? "1px solid #dfdfdf" : "unset"};
    border-bottom:1px solid #dfdfdf;
    padding: 15px 10px;
    font-size: 16px;
`;

function EditMember({ userObj, refreshUser }){

    const [newDisplayName, setNewDisplayName] = useState((userObj.displayName) ? userObj.displayName : '');
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [phoneId, setPhoneId] = useState("");
    const [dbPhoneNumber, setDbPhoneNumber] = useState(false);    


    const navigate = useNavigate();

    // console.log(userObj)

    const getTelephone = async() => {
        
        const db_query = query( 
            collection(dbService, "user"),
            where("uid", "==" , userObj.uid),
            limit(1)
        )

        const telephone = await getDocs(db_query);
        if(!telephone.empty){
            telephone.forEach((document) => {
                setNewPhoneNumber(document.data().telephone)
                setPhoneId( document.id )
            });
            setDbPhoneNumber(true);
        }
    }
    
    useEffect(() => {
        getTelephone();
    }, [])
    
    

    const onChange = (event) => {
        const {
            target : {name, value}, 
        } = event;
        if( name === "name" ){
            setNewDisplayName(value);
        }
        if( name === "tell" ){
            setNewPhoneNumber(value);
        }
        
    }

    const onSubmit = async(event) => {
        event.preventDefault();
        const user = authService.currentUser;
        /* 성함 변경 */
        if(userObj.displayName !== newDisplayName) { 
            await updateProfile(user, {
                displayName: newDisplayName,
            });
        }
        /* 
            1. 핸드폰번호 등록
            빈값이면 db에 핸드폰 번호가 등록이 안되어있다는 뜻 , 
            새로 업로드 해준다. 값이 없으면 수정하기.
        */
       if(dbPhoneNumber){ 
            //수정하기
            console.log(userObj.uid, newPhoneNumber);
            
            const telephoneRef = doc(dbService, "user" , `${phoneId}`);
            await updateDoc(telephoneRef, {
                uid : user.uid,
                telephone: newPhoneNumber
            });


       }else{ 
            //등록하기 
            await addDoc(collection(dbService, "user"), {
                uid : user.uid, 
                telephone : newPhoneNumber
            });
       }
        
        /* 새로고침후, 데이터 불러오기 */
        refreshUser();
        navigate("/mypage");
    };

    return (
        <>
           <Header title="회원정보 수정"/>
           <div className="sub_content">
                <form onSubmit={onSubmit}>
                    <div className={styles.Editform}>
                        <div className={styles.ipt_wrap}>
                            <p className={styles.label}>성함<b>*</b></p>
                            <p>
                                <input 
                                    type="text"
                                    name="name"
                                    placeholder="성함을 입력해주세요"
                                    className={styles.ipt}
                                    onChange={onChange}
                                    value={newDisplayName}
                                    required
                                />
                            </p>
                        </div>
                        <div className={styles.ipt_wrap}>
                            <p className={styles.label}>연락처</p>
                            <p>
                                <input 
                                    type="number"
                                    name="tell"
                                    placeholder="핸드폰번호"
                                    className={styles.ipt}
                                    value={newPhoneNumber}
                                    onChange={onChange}
                                />
                            </p>
                        </div>
                        <div className={styles.ipt_wrap}>
                            <p className={styles.label}>아이디</p>
                            <p>
                                <input 
                                    type="email"
                                    name="email"
                                    placeholder="아이디"
                                    className={styles.ipt}
                                    required
                                    disabled
                                    value={userObj.email}
                                />
                            </p>
                        </div>
                        
                        <div className={styles.ipt_wrap}>
                            <p className={styles.label}>비밀번호<b>*</b></p>
                            <p>
                                <input 
                                    type="password"
                                    name="password"
                                    placeholder="비밀번호를 입력해주세요."
                                    className={styles.ipt}
                                />
                            </p>
                        </div>
                        <div className={styles.ipt_wrap}>
                            <p className={styles.label}>비밀번호 확인<b>*</b></p>
                            <p>
                                <input 
                                    type="password"
                                    name="password"
                                    placeholder="비밀번호를 재입력해주세요."
                                    className={styles.ipt}
                                />
                            </p>
                        </div>
                        
                        {/* <div className={styles.ipt_wrap}>
                            <p className={styles.label}>이메일<b>*</b></p>
                            <p>
                                <input 
                                    type="email"
                                    name="email"
                                    placeholder="이메일을 입력해주세요"
                                    className={styles.ipt}
                                    required
                                />
                            </p>
                        </div> */}
                    </div>
                
                    <List>
                        <Link to="/member_withdrawal">
                            회원탈퇴
                        </Link>
                    </List>

                    <div className={styles.btnWrap}>
                        <button className={styles.ok_btn}>수정완료</button>
                    </div>
                </form>
           </div>
           <Navigation />
        </>
    );
}

export default  EditMember;