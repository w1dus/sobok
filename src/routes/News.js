import Header from 'components/Header';
import Navigation from 'components/Navigation';
import { dbService } from 'fbase';
import { collection, doc, getDoc, getDocs, namedQuery, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'; 
import { resolvePath, useNavigate } from 'react-router-dom';
import styles from './News.module.css'; 

function News(){

    const [list, setList] = useState([]);
    const [news, setNews] = useState([]);

    let navigate = useNavigate();

    const getList = async() => {
        const db_query = query(collection(dbService, "news") , where("event", "==", false), orderBy("uploadDate", "desc"));
        const docSnap = await getDocs(db_query);
        docSnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setList((prev) => [...prev, {id : document.id , ...doc.data()}]);
        });
    }

    const getNews = async() => {
        for (const item of list) {
            const db_query = doc(dbService, "store" , item.storeId);
            const docSnap = await getDoc(db_query);
            const body = {
                storeName : docSnap.data().name ,  
                ...item
            }
            setNews((prev) => [...prev, body]);
        }
    }

    useEffect(() => {
        getList();
    } , [])
    useEffect(() => {
        getNews();
    },[list])

    return (
        <>
            <Header title="소식"/>
            <div className={styles.newsContainer}>
                <ul className={styles.newsList}>
                    {news.map((item, index) => (
                        <li key={index}>
                            <div className={styles.item} onClick={() => navigate(`/detail/${item.storeId}`, {replace: true})}>
                                <div className={styles.imgBox} style={{backgroundImage: `url(${item.imgUrl})`}}></div>
                                <p className={styles.nickName}>
                                    {item.storeName}
                                </p>
                                <p className={styles.title}>
                                    {item.subject}
                                </p>
                            </div>
                        </li>
                    ))}
                    
                </ul>
            </div>
            <Navigation />
        </>
    );
}

export default  News;