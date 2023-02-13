import HeaderMain from 'components/HeaderMain';
import Navigation from 'components/Navigation';
import React, { useEffect, useRef, useState } from 'react'; 
import styles from"./Home.module.css";


import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";

import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { dbService } from 'fbase';
import { connectAuthEmulator } from 'firebase/auth';

function Home({userObj}){

    let navigate = useNavigate();

    const [data, setData] = useState([]);
    const [list, setList] = useState([]);
    const [allCheck, setAllCheck] = useState(true); //전체 (카테고리)

    /* 카테고리 */
    const [category01, setCategory01] = useState(false); //콘센트
    const [category02, setCategory02] = useState(false); //큰테이블
    const [category03, setCategory03] = useState(false); //주차장
    const [category04, setCategory04] = useState(false); //애견동반
    const [category05, setCategory05] = useState(false); //통유리
    const [category06, setCategory06] = useState(false); //흡연실
    const [category07, setCategory07] = useState(false); //노키즈존
    const [category08, setCategory08] = useState(false); //쇼파
    const [category09, setCategory09] = useState(false); //테라스

    const getList = async () => {
        
        const db_query = query( 
            collection(dbService, "store"),
            orderBy("uploadDate", "asc")
        )

        const db_list =  await getDocs(db_query);
        db_list.forEach((document) => {
            // console.log(document.id, " => ", document.data());
            const listObject = ((prev) =>  [{...document.data(), id : document.id }, ...prev] );
            setData(listObject);
            setList(listObject);
        });
    }

    // console.log(data)

    const onCategory = (event) => {
        const{
            target : {name, checked},
        } = event;

        if(checked === true){
            setAllCheck(false)
        }

        if(name === 'category01'){ setCategory01(checked); }
        if(name === 'category02'){ setCategory02(checked); }
        if(name === 'category03'){ setCategory03(checked); }
        if(name === 'category04'){ setCategory04(checked); }
        if(name === 'category05'){ setCategory05(checked); }
        if(name === 'category06'){ setCategory06(checked); }
        if(name === 'category07'){ setCategory07(checked); }
        if(name === 'category08'){ setCategory08(checked); }
        if(name === 'category09'){ setCategory09(checked); }

    }

    const allCheckChange = (event) => {
        setAllCheck(event.target.checked);
        if(!allCheck){
            setCategory01(false);
            setCategory02(false);
            setCategory03(false);
            setCategory04(false);
            setCategory05(false);
            setCategory06(false);
            setCategory07(false);
            setCategory08(false);
            setCategory09(false);
        }else{
            setCategory01(true);
            setCategory02(true);
            setCategory03(true);
            setCategory04(true);
            setCategory05(true);
            setCategory06(true);
            setCategory07(true);
            setCategory08(true);
            setCategory09(true);
        }
        
    }

    const setCategory = () => {
        if(allCheck){
            setList(data)
        }else{
            const body = data.filter(item => (
                ((category01) ? item.socket === '있음' : true )
                && ((category02) ? item.bigTable === '있음' : true )
                && ((category03) ? item.parking === '있음' : true )
                && ((category04) ? item.pets === '있음' : true )
                && ((category05) ? item.fullGlass === '있음' : true )
                && ((category06) ? item.smoking === '있음' : true )
                && ((category07) ? item.noKids === '있음' : true )
                && ((category08) ? item.sofa === '있음' : true )
                && ((category09) ? item.terrace === '있음' : true )
            ))
            setList(body);
        }
        
    }

    useEffect( () => {
            getList();
    } , [])


    useEffect(() => {
        setCategory();
    }, [allCheck, category01, category02, category03, category04, 
        category05, category06, category07, category08, category09])


    const pagination = {
        clickable: true,
        renderBullet: function (index, className) {
            return ('<span class="' + className + '"  ></span>');
        },
    };

    return (
        <>
            <HeaderMain />
            
            <div className={styles.main_container}>

                {/*스와이퍼*/}
                <div className={`${styles.slideContainer} main_slide`}>
                    <Swiper
                        pagination={pagination}
                        modules={[Pagination]}
                        className={styles.mySwiper}
                        loop={true}
                    >
                        <SwiperSlide className={styles.swiper} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/main_banner01.png)`}}></SwiperSlide>
                        <SwiperSlide className={styles.swiper} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/main_banner02.png)`}}></SwiperSlide>
                        <SwiperSlide className={styles.swiper} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/main_banner03.png)`}}></SwiperSlide>
                        <SwiperSlide className={styles.swiper} style={{backgroundImage: `url(${process.env.PUBLIC_URL}/images/main_banner04.png)`}}></SwiperSlide>
                    </Swiper>
                </div>

                {/*카테고리*/}
                <div className={styles.category_wrap}>
                    <ul className={styles.category_container}>
                        <li>
                            <input 
                                type="checkbox" 
                                id="all" 
                                checked={allCheck} 
                                onChange={allCheckChange}
                                readOnly
                            />
                            <label htmlFor="all">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_all.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_all_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                            </label>
                            <p className={styles.title}>전체</p>
                        </li>
                        <li>
                            <input type="checkbox" 
                                name="category01" 
                                id="icon01" 
                                checked={category01} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon01">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_flog.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_flog_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                            </label>
                            <p className={styles.title}>콘센트</p>
                        </li>
                        <li>
                            <input 
                                type="checkbox" 
                                name="category02" 
                                id="icon02"
                                checked={category02} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon02">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_study_table.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_study_table_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>큰 테이블</p>
                            </label>
                        </li>
                        <li>
                            <input 
                                type="checkbox" 
                                id="icon03"
                                name="category03" 
                                checked={category03} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon03">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_parking.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_parking_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>주차장</p>
                            </label>
                        </li>
                        <li >
                            <input 
                                type="checkbox" 
                                id="icon04"
                                name="category04" 
                                checked={category04} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon04">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_pat.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_ca_pat_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>애견동반</p>
                            </label>
                        </li>
                        <li >
                            <input 
                                type="checkbox" 
                                id="icon05"
                                name="category05" 
                                checked={category05} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon05">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_mirror.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_mirror_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>통유리</p>
                            </label>
                        </li>
                        <li >
                            <input 
                                type="checkbox" 
                                id="icon06"
                                name="category06" 
                                checked={category06} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon06">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_smoking.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_smoking_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>흡연실</p>
                            </label>
                        </li>
                        <li >
                            <input 
                                type="checkbox" 
                                id="icon07"
                                name="category07" 
                                checked={category07} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon07">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/min_sec_nokids.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/min_sec_nokids_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>노키즈존</p>
                            </label>
                        </li>
                        <li >
                            <input 
                                type="checkbox" 
                                id="icon08"
                                name="category08" 
                                checked={category08} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon08">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_sofa.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_sofa_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>쇼파</p>
                            </label>
                        </li>
                        <li >
                            <input 
                                type="checkbox" 
                                id="icon09"
                                name="category09" 
                                checked={category09} 
                                onChange={onCategory}
                                readOnly
                            />
                            <label htmlFor="icon09">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_terrace.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_terrace_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>테라스</p>
                            </label>
                        </li>
                        {/* <li >
                            <input type="checkbox" id="icon10"/>
                            <label htmlFor="icon10">
                                <div className={styles.category_icon}>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_terrace.svg`} className={styles.icon} alt="all"/>
                                    <img src={`${process.env.PUBLIC_URL}/images/main_sec_terrace_active.svg`} className={`${styles.icon_active}`}  alt="all"/>
                                </div>
                                <p className={styles.title}>루프탑</p>
                            </label>
                        </li> */}
                    </ul>
                </div>
                
                {/*카페 목록*/}
                <ul className={styles.store_list}>
                    {
                        list.map((item, index) => (
                            <li key={index}>
                                <Link to={`/detail/${item.id}`}>
                                <div className={styles.store_wrap} onClick={() => {navigate(`/detail/${item.storeId}`, {replace: true})}}>
                                    <div className={styles.imgBox} style={{backgroundImage: `url(${item.thumbnail01})`}}>
                                        {/* <button type="button" className={styles.zzim_btn}>
                                            <img src={`${process.env.PUBLIC_URL}/images/zzim.svg`} alt="버킷등록" className={styles.default}/>
                                            <img src={`${process.env.PUBLIC_URL}/images/zzim_active.svg`} alt="버킷등록" className={styles.active}/>
                                        </button> */}
                                    </div>
                                    <div className={styles.title_wrap}>
                                        <p className={styles.title}>
                                            {item.name}
                                        </p>
                                        {/* <p className={styles.distance}>
                                            <img src={`${process.env.PUBLIC_URL}/images/distance_icon.svg`} alt="거리"/>
                                            673m
                                        </p> */}
                                    </div>
                                </div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

            

            <Navigation />
        </>
    );
}

export default  Home;