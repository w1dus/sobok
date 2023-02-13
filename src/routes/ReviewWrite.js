
import Header from "components/Header";
import Navigation from "components/Navigation";
import { authService, dbService } from "fbase";
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from"./ReviewWrite.module.css";
import {v4 as uuidv4} from "uuid";

function ReviewWrite({userObj}){
    
    const navigate = useNavigate();
    const {id} = useParams();

    const [file, setFile] = useState("");
    const [content, setContent] = useState("");

    const user = authService.currentUser;

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
        setContent(event.target.value)
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        const storage = getStorage();
        const storageRef = ref(storage, `review/${id}/${uuidv4()}`); 
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
                    const newReview = doc(collection(dbService, "review"));
                    const docData = {
                        storeId : id, //스토어 아이디 
                        imgUrl : downloadURL, //이미지 url
                        content : content, 
                        uid : user.uid, //회원아이디 
                        uploadDate: Timestamp.fromDate(new Date()),
                        date : date,
                        displayName : user.displayName,
                    };
                    
                    setDoc(newReview, docData);
                    navigate(`/detail/${id}`);
                });
            }
        );

    }

    // console.log(file);


    return(
        <div>
            <Header title="리뷰등록"/>
            <div className="sub_content">
                <form onSubmit={onSubmit}>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>리뷰 이미지 등록</p>
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
                        <div className={styles.label}>리뷰내용<b>*</b></div>
                        <textarea 
                            type="text" 
                            name="content" 
                            required
                            className={styles.ipt}
                            placeholder="리뷰 내용을 입력해주세요." 
                            onChange={onChange}
                            value={content}
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
        </div>
    )
}

export default ReviewWrite; 