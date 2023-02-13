import Header from "components/Header";
import Navigation from "components/Navigation";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from"./ItemRegist.module.css";
import {v4 as uuidv4} from "uuid";
import { addDoc, collection} from "firebase/firestore";
import { dbService } from "fbase";

function ItemRegist(){

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [made, setMade] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [percent, setPercent] = useState("");
    const [url, setUrl] = useState("");
    const [thumbnail, setThumbnail] = useState("");

    const onFileChange = (event) => {
        const{
            target : {name, files},
        } = event;
        if(name === "thumbnail"){
            const theFile = files[0];
            setThumbnail(theFile)
        }
    }
    const onChange = (event) => {
        const{
            target : {name, value}
        } = event;

        if(name==="name"){ setName(value); }
        if(name==="made"){ setMade(value); }
        if(name==="price"){ setPrice(value); }
        if(name==="discount"){ setDiscount(value); }
        if(name==="percent"){ setPercent(value); }
        if(name==="url"){ setUrl(value); }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const storage = getStorage();
        const storageRef = ref(storage, `item/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, thumbnail);

        uploadTask.on('state_changed', 
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            }, 
            (error) => {
                // Handle unsuccessful uploads
            }, 
            () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //console.log('File available at', downloadURL);
                    const newItemRef = collection(dbService, "item");
                    addDoc(newItemRef, {
                        name : name, 
                        made : made, 
                        price : price, 
                        discount : discount, 
                        percent : percent, 
                        url : url, 
                        thumbnail : downloadURL,
                    });
                    navigate(`/store`);
                });
            }
        );

    }


    return(
        <>
            <Header title="스토어 상품등록"/>
            <div className="sub_content">
                <div className={styles.title}>상품정보</div>
                <form onSubmit={onSubmit}>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>상품 이미지 등록<b>*</b> <span className={styles.important}>(권장 사이즈 : 225x150)</span></p>
                        <p>
                            <input 
                                type="file" 
                                name="thumbnail"
                                className={styles.file} 
                                accept="image/*"
                                required
                                onChange={onFileChange}
                            />
                        </p>
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>상품명 <b>*</b></div>
                        <input 
                            type="text" 
                            name="name" 
                            className={styles.ipt}
                            required
                            value={name}
                            onChange={onChange}
                            placeholder="상품명을 입력해주세요." 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>제조사 <b>*</b></div>
                        <input 
                            type="text" 
                            name="made" 
                            className={styles.ipt}
                            required
                            value={made}
                            onChange={onChange}
                            placeholder="제조사를 입력해주세요." 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>원가 <b>*</b></div>
                        <input 
                            type="number" 
                            name="price" 
                            className={styles.ipt}
                            required
                            value={price}
                            onChange={onChange}
                            placeholder="원가를 입력해주세요. (숫자만 입력)" 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>할인가 <b>*</b></div>
                        <input 
                            type="number" 
                            name="discount" 
                            className={styles.ipt}
                            required
                            value={discount}
                            onChange={onChange}
                            placeholder="할인가를 입력해주세요. (숫자만 입력)" 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>할인율 <b>*</b></div>
                        <input 
                            type="text" 
                            name="percent" 
                            className={styles.ipt}
                            required
                            value={percent}
                            onChange={onChange}
                            placeholder="할인율을 입력해주세요 (%를 제외하고 입력)" 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>링크<b>*</b></div>
                        <input 
                            type="url" 
                            name="url" 
                            className={styles.ipt}
                            required
                            value={url}
                            onChange={onChange}
                            placeholder="링크를 입력해주세요(https://포함)" 
                        />
                    </div>
                    <ul className={styles.btn_container}>
                        <li>
                            <button 
                                type="button" 
                                className={styles.cancelBtn}
                                onClick={() => {navigate(-1)}}
                            >취소</button>
                        </li>
                        <li>
                            <button type="submit" className={styles.submitBtn}>등록</button>
                        </li>
                    </ul>
                </form>
            </div>
            <Navigation />
        </>
    )
}

export default ItemRegist;