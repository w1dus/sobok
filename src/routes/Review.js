import Header from 'components/Header';
import Navigation from 'components/Navigation';
import { dbService } from 'fbase';
import { collection, doc, getDoc, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'; 
import { Link } from 'react-router-dom';
import styles from './Review.module.css'; 

function Review(){

    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    const getList = async () => {
        const db_query = query(collection(dbService, "review"));
        const docSnap = await getDocs(db_query);
        docSnap.forEach((document) => {
            setData((prev) => [...prev, document.data()]);
        });
    }

    const getStore = async() => {
        for(const item of data){
            const docRef = doc(dbService, "store", item.storeId);
            const docSnap = await getDoc(docRef);
            const body = {
                name : docSnap.data().name, //가게 이름
                thumbnail : docSnap.data().thumbnail01, // 가게 썸네일 이미지
                ...item
            }
            setList((prev) => [...prev, body]);
        }
    }

    console.log(list);

    useEffect(() => {
        getList();
    }, [])
    useEffect(() => {
        getStore();
    }, [data])

    return (
        <>
            <Header title="리뷰"/>
            <div className={styles.eventContainer}>
                <ul className={styles.eventList}>
                    {list.map((item, idx) => (
                        <li key={idx}>
                            <div className={styles.item}>
                                <div className={styles.date}>{item.date}</div>
                                <div className={styles.titleWrap}>
                                    <Link to={`/detail/${item.storeId}`}>
                                        <div className={styles.imgBox} style={{backgroundImage: `url(${item.thumbnail})`}}></div>
                                    </Link>
                                    <div className={styles.info}>
                                        <p className={styles.name}>
                                            {item.displayName}
                                        </p>
                                        <Link to={`/detail/${item.storeId}`}>
                                            <p className={styles.category}>{item.name}</p>
                                        </Link>
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
                                    <p className={styles.content}>
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Navigation />
        </>
    );
}

export default  Review;