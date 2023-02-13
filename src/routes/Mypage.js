import Header from 'components/Header';
import Navigation from 'components/Navigation';
import React, { useEffect } from 'react'; 
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import styles from"./MyPage.module.css";
import { authService, dbService } from 'fbase';
import { useNavigate } from "react-router";


function Mypage({ userObj, refreshUser }){

    const navigate = useNavigate();

    const onLogOutClick = () => {
        authService.signOut()
        navigate("/");
    };


    useEffect(() => {

    },[])

    return (
        <>
           <Header title="마이페이지"/>
           <div className="sub_content">
                <div className={styles.profileWrap}>
                    <div className={styles.leftBox}>
                        {(userObj) ? 
                        <>
                            <p className={styles.name}><span>{(userObj.displayName) ? userObj.displayName : '소복회원'}</span>님 마이페이지</p>
                            <p className={styles.produce}>우리동네 개인카페 스탬프 투어</p>
                        </>
                        : 
                        <>
                            <p className={styles.name}><span>{(userObj.displayName) ? userObj.displayName : '비회원'}</span>님 </p>
                            <p className={styles.produce}>회원 가입 후 이용 가능합니다.</p>
                        </>
                        }
                        
                    </div>
                    <div className={styles.rightBox}>
                    {(userObj) ? 
                        <button onClick={onLogOutClick}>로그아웃</button>
                        : 
                        <button onClick={() => navigate("/")}>로그인</button>
                    }
                    </div>
                </div>

                {(userObj) ? 
                <>
                    <ul className={styles.stampList}>
                        <li>
                            <Link to="/stamp_accumulate">
                                <div className={styles.item}>
                                    <div className={styles.icon}></div>
                                    <p className={styles.title}>통합스템프 적립</p>
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link to="/stamp">
                                <div className={styles.item}>
                                    <div className={styles.icon}></div>
                                    <p className={styles.title}>적립내역</p>
                                    {/* 점주한테는 발급내역으로, 링크는 /stamp_list로 변경하기 */}
                                </div>
                            </Link>
                        </li>
                    </ul>
                    {(userObj.uid === "NYuAk2HegjWWrnp3GgXkSI0xIb53") ? 
                        <>
                        <div className={styles.StoreBtnWrap}>
                            <Link to="/stamp_issue">
                                <button className={styles.orangeBtn}>
                                    회원 적립하기
                                </button>
                            </Link>
                        </div>
                        <div className={styles.StoreBtnWrap}>
                            <Link to="/apply_admin">
                                <button className={styles.orangeBtn}>
                                    신청내역
                                </button>
                            </Link>
                        </div>
                        <div className={styles.StoreBtnWrap}>
                            <Link to="/stamp_application">
                                <button className={styles.orangeBtn}>
                                    카페 스탬프 제휴 신청하기 
                                </button>
                            </Link>
                        </div>
                        </>
                        
                        : 
                        <div className={styles.StoreBtnWrap}>
                        <Link to="/apply">
                            <button className={styles.orangeBtn}>
                                신청내역
                            </button>
                        </Link>
                    </div>
                    }
                    <div className={styles.StoreBtnWrap}>
                        <div className={styles.StoreInfo}>
                            <p className={styles.title} style={{fontSize: "18px", marginBottom:"5px"}}>현재 참여중인 카페 스탬프 투어</p>
                            <p className={styles.title}><span className={styles.orange}>경희대학교 인근 카페 투어</span></p>
                            <p className={styles.done}>2022.11.01~2023.01.31</p>
                            <p className={styles.title}><span className={styles.orange}>회기시장 카페 투어</span></p>
                            <p className={styles.done}>2022.11.01~2023.02.28<span></span></p>
                            {/* <p className={styles.done}>종료일</p>
                            <p className={styles.date}>2022.01.01</p> */}
                        </div>
                    </div>
                    <Link to="/editmember">
                        <List bordertop>회원정보 수정</List>
                    </Link>
                    {(userObj.uid === "NYuAk2HegjWWrnp3GgXkSI0xIb53") ? 
                        <Link to="/store_regist">
                            <List>재휴매장등록</List>
                        </Link>
                        : 
                        null
                    }
                    {(userObj.uid === "NYuAk2HegjWWrnp3GgXkSI0xIb53") ? 
                        <Link to="/item_regist">
                            <List>스토어상품등록</List>
                        </Link>
                        : 
                        null
                    }
                    {/* <Link to="/event_regist">
                        <List>이벤트등록</List>
                    </Link> */}
                    {/* <Link to="/stamp_modify">
                        <List>쿠폰 정보 변경</List>
                    </Link> */}
                </>
                :
                    null
                }
                
                
                

                
                
           </div>
           <Navigation />
        </>
    );
}

export default  Mypage;

const List = styled.div`
    /* 마이페이지 리스트 */
    border-top: ${props => props.bordertop ? "1px solid #dfdfdf" : "unset"};
    border-bottom:1px solid #dfdfdf;
    padding: 15px 10px;
    font-size: 16px;
`;