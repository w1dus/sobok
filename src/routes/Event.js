
import Header from 'components/Header';
import Navigation from 'components/Navigation';
import { dbService } from 'fbase';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Event.module.css'; 


function Event () {

    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    const getData = async () => {
        const db_query = query(collection(dbService, "news") , where("event", "==", true), orderBy("uploadDate", "desc"));
        const docSnap = await getDocs(db_query);
        docSnap.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            setData((prev) => [...prev, {id : document.id , ...doc.data()}]);
        });
    }

    const getList = async () => {
        for (const item of data) {
            const db_query = doc(dbService, "store" , item.storeId);
            const docSnap = await getDoc(db_query);
            const body = {
                storeName : docSnap.data().name ,  
                storeImage : docSnap.data().thumbnail01,
                ...item
            }
            setList((prev) => [...prev, body]);
        }
    }

    useEffect(() => {
        getData();
    }, [])
    useEffect(() => {
        getList();
    }, [data])

    return (
        <>
            <Header title="이벤트"/>
            <div className={styles.eventContainer}>
                <ul className={styles.eventList}>
                    {list.map((item, index) => (
                        <li key={index}>
                            <div className={styles.item}>
                                <div className={styles.date}>{item.date}</div>
                                <div className={styles.titleWrap}>
                                    <Link to={`/detail/${item.storeId}`}>
                                        <div className={styles.imgBox} style={{backgroundImage: `url(${item.storeImage})`}}></div>
                                    </Link>
                                    <div className={styles.info}>
                                        <p className={styles.name}>
                                            <Link to={`/detail/${item.storeId}`}>
                                                {item.storeName}
                                            </Link>
                                        </p>
                                        <p className={styles.category}>{item.category}</p>
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
                                    <p className={styles.title}>
                                        {item.subject}
                                    </p>
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
    ) ;
}

export default Event; 


