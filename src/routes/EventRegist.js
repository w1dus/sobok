import styles from"./EventRegist.module.css";
import {v4 as uuidv4} from "uuid";
import Header from "components/Header";
import Navigation from "components/Navigation";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function EventRegist () {

    const navigate = useNavigate();

    const [thubnail, setThumbnail] = useState("");

    const onFileChange = (event) => {
        const{
            target : {name, files},
        } = event;
        if(name === "thumbnail"){
            const theFile = files[0];
            setThumbnail(theFile)
        }
    }


    return(
        <>
            <Header title="스토어 상품등록"/>
            <div className="sub_content">
                <form>
                <div className={styles.ipt_wrap}>
                        <p className={styles.label}>상품 이미지 등록<b>*</b> <span className={styles.important}>(권장 사이즈 : 225x150)</span></p>
                        <p>
                            <input 
                                type="file" 
                                name="thumbnail"
                                className={styles.file} 
                                accept="image/*"
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
                            placeholder="상품명을 입력해주세요." 
                        />
                    </div>
                </form>
            </div>
            <Navigation />
        </>
    )
}

export default EventRegist;