import styles from"./Detail.module.css";
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import Navigation from 'components/Navigation';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where} from "firebase/firestore";
import { dbService } from "fbase";

function Detail({userObj}){

    let navigate = useNavigate();
    const [tabMenu, setTabMenu] = useState("정보");
    const [data, setData] = useState([]); 
    const [review, setReview] = useState([]);
    const [news, setNews] = useState([]);
    const [url, setUrl] = useState("");
    const urlInputs = useRef();


    const {id} = useParams();
    // console.log(data)

    const getData = async() => {
        const docRef = doc(dbService, "store", id);
        const docSnap = await getDoc(docRef);
        setData(docSnap.data());
    }

    const getNews = async() => {
        const db_query = query(collection(dbService, "news"), where("storeId", "==", id));
        const docSnap = await getDocs(db_query);
        docSnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setNews((prev) => [...prev, { id : doc.id ,...doc.data()}]);
        });
    }

    const getReview = async() => {
        const db_query = query(collection(dbService, "review"), where("storeId", "==", id));
        const docSnap = await getDocs(db_query);
        docSnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setReview((prev) => [...prev,{ id : doc.id , ...doc.data()}]);
        });
    }

    //링크복사 함수
    const getUrl = () => {
        const url = window.document.location.href;
        window.navigator.clipboard.writeText(url).then(() => {
            alert("URL이 복사되었습니다.");
        }) 
    }

    useEffect(() => {
        getData(); 
        getReview();
        getNews();
    } , [])
     
    console.log(news);


    return (
        <div className={styles.detailContainer}>

            <header className={styles.header}>
                <button type="button" className={styles.backBtn} onClick={() => {navigate(-1)}}>
                    <img src={`${process.env.PUBLIC_URL}/images/white_back_icon.svg`} alt="뒤로"/>
                </button>
                {/* <button type="button" className={styles.zzimBtn}>
                    <img src={`${process.env.PUBLIC_URL}/images/zzim.svg`} alt="찜등록" />
                    <img src={`${process.env.PUBLIC_URL}/images/zzim_active.svg`} alt="찜" className={styles.active}/>
                </button> */}
            </header>
            {/*imgSlide */}
            <div className={styles.imgSlide}>
                <Swiper 
                    className={styles.mySwiper}
                    loop={true}
                >   
                    <SwiperSlide className={styles.slide} style={{backgroundImage: `url(${data.thumbnail01})`}}></SwiperSlide>
                    {(data.thumbnail02) ? <SwiperSlide className={styles.slide} style={{backgroundImage: `url(${data.thumbnail02})`}}></SwiperSlide> : null}
                    {(data.thumbnail03) ? <SwiperSlide className={styles.slide} style={{backgroundImage: `url(${data.thumbnail03})`}}></SwiperSlide> : null}
                    {(data.thumbnail04) ? <SwiperSlide className={styles.slide} style={{backgroundImage: `url(${data.thumbnail04})`}}></SwiperSlide> : null}
                    {(data.thumbnail05) ? <SwiperSlide className={styles.slide} style={{backgroundImage: `url(${data.thumbnail05})`}}></SwiperSlide> : null}
                </Swiper>
            </div>

            {/* infoContainer */}
            <div className={styles.infoContainer}>
                <div className={styles.title}>
                    {data.name }
                    {/* <button type="button" className={styles.modifyBtn}>
                        <img src={`${process.env.PUBLIC_URL}/images/modify_btn.svg`} alt="수정"/>
                    </button> */}
                </div>
                <div className={styles.produce}>
                    {data.explanation}
                </div>
            </div>
            
            {/* menuContainer */}
            <ul className={styles.menuContainer}>
                <li className={(tabMenu === '정보') ? styles.active : null}>
                    <span className={styles.title} onClick={()=>{setTabMenu("정보");}}>정보</span>
                </li>
                <li className={(tabMenu === '소식') ? styles.active : null}>
                    <span className={styles.title} onClick={()=>{setTabMenu("소식");}}>소식</span>
                </li>
                <li className={(tabMenu === '메뉴') ? styles.active : null}>
                    <span className={styles.title} onClick={()=>{setTabMenu("메뉴");}}>메뉴</span>
                    {/* <span className={styles.newIcon}>New</span> */}
                </li>
                <li className={(tabMenu === '리뷰') ? styles.active : null}>
                    <span className={styles.title} onClick={()=>{setTabMenu("리뷰");}}>리뷰</span>
                    {/* <span className={styles.newIcon}>New</span> */}
                </li>
            </ul>

            {/* dataContainer */}

            {(tabMenu === '정보') ? 
                <div className={styles.menu01_cotain}>
                    <div className={styles.dataContainer}>
                        <p className={styles.data}>{data.tel}</p>
                        <p className={styles.data}>{data.add01} {data.add02}</p>
                        <p className={styles.data}>{data.time}</p>
                    </div>
                    <ul className={styles.menu}>
                        <li>
                            {(data.direction) ? 
                                <a href={data.direction} target="_blank" rel="noreferrer">
                                    <span>길찾기</span>
                                </a>
                            :
                                <span>길찾기</span>
                            }
                            
                        </li>
                        <li>
                            <span onClick={() => getUrl()}>
                                공유하기
                            </span>
                        </li>
                    </ul>
                    <div className={styles.modifyBtn}>
                        <p className={styles.title}>{data.explanation}</p>
                    </div>
                    <ul className={styles.infoList}>
                        {(data.socket === "있음") ? 
                            <li>
                                <div>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_flog_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>콘센트</p>
                            </li>
                            : null
                        }
                        {(data.bigTable === "있음") ? 
                            <li>
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_study_table_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>큰 테이블</p>
                            </li>
                            : null
                        }
                        {(data.parking === "있음") ? 
                            <li >
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_parking_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>주차장</p>
                            </li>
                            : null
                        }
                        {(data.pets === "있음") ? 
                            <li >
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_pat_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>애견동반</p>
                            </li>
                            : null
                        }
                        {(data.fullGlass === "있음") ? 
                             <li>
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_mirror_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>통유리</p>
                            </li>
                            : null
                        }
                        {(data.smoking === "있음") ? 
                            <li >
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_smoking_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>흡연실</p>
                            </li>
                            : null
                        }
                        {(data.noKids === "있음") ? 
                            <li >
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/min_sec_nokids_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>노키즈존</p>
                            </li>
                            : null
                        }
                        {(data.sofa === "있음") ? 
                            <li >
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_sofa_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>쇼파</p>
                            </li>
                            : null
                        }
                        {(data.terrace === "있음") ? 
                            <li >
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_terrace_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>테라스</p>
                            </li>
                            : null
                        }
                        {(data.rooftop === "있음") ? 
                            <li >
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_terrace_active.svg`} className={`${styles.icon}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>루프탑</p>
                            </li>
                            : null
                        }
                    </ul>
                </div>
                : 
                null
            }
            
            {(tabMenu === '소식') ? 
                <div className={styles.eventContainer}>
                     {(userObj.uid === "NYuAk2HegjWWrnp3GgXkSI0xIb53") ?
                        <div className={styles.btnWrap}>
                            <button className={styles.reviewBtn} onClick={() => navigate(`/news_write/${id}`)}>
                                <img src={`${process.env.PUBLIC_URL}/images/modify_btn.svg`} alt="소식등록"/> 소식 등록
                            </button>
                        </div>
                        :
                        null
                    }
                    
                    <ul className={styles.eventList}>
                        {(news.length !== 0) ? 
                            news.map((item) => (
                                <li key={item.id}>
                                    <div className={styles.item}>
                                        <p className={styles.date}>{item.date}</p>
                                        <div className={styles.titleWrap}>
                                            <div className={styles.imgBox} style={{backgroundImage: `url(${data.thumbnail01})`}}></div>
                                            <div className={styles.info}>
                                                <p className={styles.name}>
                                                {data.name}
                                                </p>
                                                <p className={styles.category}>{item.category}</p>
                                            </div>
                                        </div>
                                        {(item.imgUrl) ? 
                                            <div className={styles.imgBox}  style={{backgroundImage: `url(${item.imgUrl})`}}></div>
                                            : 
                                            null
                                        }
                                        
                                        <div className={styles.contentBox}>
                                            <p className={styles.title}>
                                                {item.subject}
                                            </p>
                                            <p className={styles.content}>
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))
                            :
                            <li>
                                <div className={styles.emptyBox}>
                                    등록된 소식이 없습니다.
                                </div>
                            </li>
                        }
                        
                    </ul>
                </div>
                : 
                null
            } 

            { (tabMenu === '메뉴') ? 
                <div className={styles.menu03_contain}>
                    {(data.menu) ? 
                    <img src={data.menu} alt="menu" />
                    :
                    "등록된 메뉴가 없습니다."
                    }
                </div>
                :
                null
            }

            { (tabMenu === '리뷰') ? 
                <div className={styles.eventContainer}>
                    {(userObj) ? 
                        <div className={styles.btnWrap}>
                            <button className={styles.reviewBtn} onClick={() => navigate(`/review_write/${id}`)}>
                                <img src={`${process.env.PUBLIC_URL}/images/modify_btn.svg`} alt="리뷰등록"/> 리뷰 등록
                            </button>
                        </div>
                        : 
                        null
                    }
                    
                    <ul className={styles.eventList}>
                        {(review.length !== 0) ? 
                            review.map((item, idx) => (
                                <li key={idx}>
                                    <div className={styles.item}>
                                        <div className={styles.date}>{item.date}</div>
                                        <div className={styles.titleWrap}>
                                            {/* <div className={styles.imgBox}></div> */}
                                            <div className={styles.info}>
                                                <div className={styles.name}>
                                                    {item.displayName}
                                                </div>
                                            </div>
                                        </div>
                                        {(item.imgUrl) ? 
                                            <div 
                                                className={styles.imgBox} 
                                                style={{backgroundImage: `url(${item.imgUrl})`}}
                                            >
                                            </div>
                                            : 
                                            null
                                        }
                                        <div className={styles.contentBox}>
                                            <div className={styles.content}>
                                                {item.content}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                        ))
                        :
                            <li>
                                <div className={styles.emptyBox}>
                                    등록된 리뷰가 없습니다🥲<br/>첫 리뷰를 등록해주세요.
                                </div>
                            </li>
                        }
                    </ul>
                </div>
                :
                null
            }

            <Navigation />
        </div>
    );
}

export default  Detail;