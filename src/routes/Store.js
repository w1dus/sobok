import Header from 'components/Header';
import Navigation from 'components/Navigation';
import { dbService } from 'fbase';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'; 
import ItemRegist from './ItemRegist';
import styles from './Store.module.css'; 

function Store(){

    const [list, setList] = useState([]);
    
    const getData = async () => {
        const db_query = query( 
            collection(dbService, "item"),
        )
        const db_list =  await getDocs(db_query);
        db_list.forEach((document) => {
            // console.log(document.id, " => ", document.data());
            const body = ((prev) => [{...document.data(), id : document.id }, ...prev])
            setList(body)
        });
    }
    // console.log(list);

    useEffect(() => {
        getData();
    } , [])

    return (
        <>
           <Header title="스토어"/>
            <div className={styles.storeContainer}>
                <ul className={styles.storeList}>
                    {
                        list.map((item, index) => (
                            <li key={index}>
                                <a href={item.url} target="_balnk">
                                    <div className={styles.item}>
                                        <div className={styles.imgBox} style={{backgroundImage: `url(${item.thumbnail})`}}></div>
                                        <p className={styles.storeName}>{item.made}</p>
                                        <p className={styles.itemName}>
                                            {item.name}
                                        </p>
                                        <p className={styles.priceBox}>
                                            <span className={styles.percent}>{item.percent}%</span>
                                            <span className={styles.price}>{Number(item.discount).toLocaleString()} 원</span>
                                        </p>
                                    </div>
                                </a>
                            </li>
                        ))
                    }
                </ul>
            </div>
           <Navigation />
        </>
    );
}

export default  Store;