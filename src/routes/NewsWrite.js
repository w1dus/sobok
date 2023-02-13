import Header from "components/Header";
import Navigation from "components/Navigation";
import styles from"./NewsWrite.module.css";
import {v4 as uuidv4} from "uuid";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { authService, dbService } from "fbase";

function NewsWrite(){

    const navigate = useNavigate();
    const {id} = useParams();
    const user = authService.currentUser;

    const [file, setFile] = useState("");
    const [subject, setSubject] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [option, setOption] = useState(false); 

    const onOption = (event) => {
        setOption(event.target.checked);
    }

    const onFileChange = (event) => {
        const{
            target : {name, files},
        } = event;
        if(name === "img"){
            const theFile = files[0];
            setFile(theFile)
        }
    }

    const onChange = (event) => {
        const {
            target : {name, value}, 
        } = event;
        if( name === "subject" ){ setSubject(value); }
        if( name === "category" ){ setCategory(value); }
        if( name === "content" ){ setContent(value); }
        
    } 

    const onSubmit = (event) => {
        event.preventDefault();
        
        const storage = getStorage();
        const storageRef = ref(storage, `news/${id}/${uuidv4()}`); 
        const uploadTask = uploadBytesResumable(storageRef, file);
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
                    const date = Intl.DateTimeFormat('kr').format(new Date());
                    const newReview = doc(collection(dbService, "news"));
                    const docData = {
                        storeId : id, //스토어 아이디 
                        imgUrl : downloadURL, //이미지 url
                        subject : subject, 
                        category : category,
                        content : content, 
                        uid : user.uid, //회원아이디 
                        uploadDate: Timestamp.fromDate(new Date()),
                        date : date,
                        displayName : user.displayName,
                        event : option,
                    };
                    
                    setDoc(newReview, docData);
                    navigate(`/detail/${id}`);
                });
            }
        );
    }


    return (
        <>
            <Header title="소식등록"/>
            <div className="sub_content">
                <form onSubmit={onSubmit}>
                    
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>옵션 <b>*</b></p>
                        <div className={styles.checkContainer}>
                            <p className={styles.checkWrap}>
                                <input type="checkbox" id="event" onChange={onOption}/>
                                <label htmlFor="event">이벤트</label>
                            </p>
                        </div>
                    </div>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>이미지 등록</p>
                        <p>
                            <input 
                                type="file" 
                                name="img"
                                className={styles.file} 
                                accept="image/*"
                                onChange={onFileChange}
                            />
                        </p>
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>제목 <b>*</b></div>
                        <input 
                            type="text" 
                            name="subject" 
                            className={styles.ipt}
                            value={subject}
                            onChange={onChange}
                            required
                            placeholder="제목을 입력해주세요." 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>카테고리<b>*</b></div>
                        <input 
                            type="text" 
                            name="category" 
                            className={styles.ipt}
                            required
                            value={category}
                            onChange={onChange}
                            placeholder="카테고리를 입력해주세요." 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>내용<b>*</b></div>
                        <textarea 
                            type="text" 
                            name="content" 
                            required
                            value={content}
                            onChange={onChange}
                            className={styles.ipt}
                            placeholder="내용을 입력해주세요." 
                        ></textarea>
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

export default NewsWrite; 