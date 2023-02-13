import Header from 'components/Header';
import Navigation from 'components/Navigation';
import { authService, dbService } from 'fbase';
import { collection, doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import styles from './StoreRegist.module.css';
import {v4 as uuidv4} from "uuid";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';


function StoreRadioWrap( {title , name , onClick} ){

    return (
        <div className={styles.ipt_wrap}>
            <div className={styles.label}>{title} <b>*</b></div>
            <ul className={styles.radio_wrap}>
                <li>
                    <input 
                        type="radio" 
                        name={name} 
                        id={`${name}_true`} 
                        value="있음" 
                        onClick={onClick}
                    /> 
                    <label  htmlFor={`${name}_true`}>
                        있음
                    </label>
                </li>
                <li>
                    <input 
                        type="radio"  
                        name={name} 
                        id={`${name}_false`} 
                        value="없음" 
                        onClick={onClick}
                    /> 
                    <label htmlFor={`${name}_false`}>
                        없음
                    </label>
                </li>
            </ul>
        </div>
    );
}


function StoreRegist({ userObj }){

    const navigate = useNavigate();
    const [status, setStatus] = useState(false); //true이면 수정, false이면 새 글 등록

    const [storeName, setStoreName] = useState(""); //매장명
    const [explanation, setExplanation] = useState(""); //매장 설명
    const [tel, setTel] = useState(""); //전화번호
    const [storeTime, setStoreTime] = useState(""); //영업시간
    const [closed, setClosed] = useState(""); //휴무일
    const [homepage, setHomepage] = useState(""); //홈페이지

    const [add01, setAdd01] = useState(""); //주소01
    const [add02, setAdd02] = useState(""); //주소02

    const [direction, setDirection] = useState(""); //길찾기 주소 


    //라디오버튼
    const [socket, setSocket] = useState(""); //콘센트
    const [bigTable, setBigTable] = useState(""); //큰 책상
    const [parking, setParking] = useState(""); //주차장
    const [pets, setPets] = useState(""); //애견동반
    const [fullGlass, setFullGlass] = useState(""); //통유리
    const [smoking, setSmoking] = useState(""); //흡연실
    const [noKids, setNoKids] = useState(""); //노키즈존
    const [sofa, setSofa] = useState(""); //쇼파
    const [terrace, setTerrace] = useState(""); //테라스
    // const [rooftop, setRooftop] = useState(""); //루프탑

    // 이미지첨부 - 썸네일 이미지 (총 5개)
    const [thumbnail01, setThumbnail01] = useState("");
    const [thumbnail02, setThumbnail02] = useState("");
    const [thumbnail03, setThumbnail03] = useState("");
    const [thumbnail04, setThumbnail04] = useState("");
    const [thumbnail05, setThumbnail05] = useState("");
    
    // 이미지 첨부 - 메뉴판 이미지 ( 총 1개 )
    const [menuImage , setMenuImage] = useState("");


    const onFileChange = (event) => {
        
        const{
            target : {name, files},
        } = event;

        if(name === "thumbnail01"){
            const theFile = files[0];
            setThumbnail01(theFile)
        }
        if(name === "thumbnail02"){
            const theFile = files[0];
            setThumbnail02(theFile)
        }
        if(name === "thumbnail03"){
            const theFile = files[0];
            setThumbnail03(theFile)
        }
        if(name === "thumbnail04"){
            const theFile = files[0];
            setThumbnail04(theFile)
        }
        if(name === "thumbnail05"){
            const theFile = files[0];
            setThumbnail05(theFile)
        }
        if(name === "menu"){
            const theFile = files[0];
            setMenuImage(theFile)
        }
    }


    const onSubmit = async (event) => {
        event.preventDefault();
        const user = authService.currentUser;
        
        /* status 가 false이면 수정이 아니므로, 새글을 등록한다 */
        if(!status){

            const folder_name = `store/${uuidv4()}`;

            /* 파일업로드  -thumbnail 01 */
            // Create a reference to the file whose metadata we want to retrieve
            const storage01 = getStorage();
            const thumbnail01Ref = ref(storage01, `${folder_name}/thumbnail01`);
            const uploadTask = uploadBytesResumable(thumbnail01Ref, thumbnail01);
            
            //문서 생성
            const newStore = doc(collection(dbService, "store"));
            await setDoc(newStore,{
                uid : user.uid, //회원아이디 
                name : storeName, //매장명
                explanation : explanation, //매장설명
                tel : tel, //연락처
                time : storeTime, //영업시간 
                closed : closed , //휴무일
                homepage : homepage, //홈페이지 주소
                add01 : add01, //주소
                add02 : add02, //상세주소
                direction: direction, //길찾기 링크
    
                socket : socket, //콘센트
                bigTable : bigTable, //큰 책상
                parking : parking, //주차장
                pets : pets, //애견동반
                fullGlass : fullGlass, //통유리
                smoking : smoking, //흡연실
                noKids : noKids , //노키즈존
                sofa : sofa , //쇼파
                terrace : terrace , //테라스

                uploadDate: Timestamp.fromDate(new Date()),//날짜
            });

            if(thumbnail01 !== undefined && thumbnail01 !== "") { 
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
                            // console.log(downloadURL);
                            updateDoc(newStore, {
                                thumbnail01: downloadURL
                            });
                        });
                    }
                );
            }

            //파일업로드 thumbnail02
            const thumbnail02Ref = ref(storage01, `${folder_name}/thumbnail02`);
            const uploadTask2 = uploadBytesResumable(thumbnail02Ref, thumbnail02); 
            if(thumbnail02 !== undefined && thumbnail02 !== "") {  
                uploadTask2.on('state_changed', 
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
                        getDownloadURL(uploadTask2.snapshot.ref).then((downloadURL) => {
                            console.log(downloadURL);
                            updateDoc(newStore, {
                                thumbnail02: downloadURL
                            });
                        });
                    }
                );
            }

            //파일업로드 thumbnail03
            const thumbnail03Ref = ref(storage01, `${folder_name}/thumbnail03`);
            const uploadTask3 = uploadBytesResumable(thumbnail03Ref, thumbnail03);  
            if(thumbnail03 !== undefined && thumbnail03 !== "") {  
                uploadTask3.on('state_changed', 
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
                        getDownloadURL(uploadTask3.snapshot.ref).then((downloadURL) => {
                            console.log(downloadURL);
                            updateDoc(newStore, {
                                thumbnail03: downloadURL
                            });
                        });
                    }
                );
            }

            if(thumbnail04 !== undefined && thumbnail04 !== "") {  
                //파일업로드 thumbnail04
                const thumbnail04Ref = ref(storage01, `${folder_name}/thumbnail04`);
                const uploadTask4 = uploadBytesResumable(thumbnail04Ref, thumbnail04);  
                uploadTask4.on('state_changed', 
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
                        getDownloadURL(uploadTask4.snapshot.ref).then((downloadURL) => {
                            console.log(downloadURL);
                            updateDoc(newStore, {
                                thumbnail04: downloadURL
                            });
                        });
                    }
                );
            }

            //파일업로드 thumbnail05
            const thumbnail05Ref = ref(storage01, `${folder_name}/thumbnail05`);
            const uploadTask5 = uploadBytesResumable(thumbnail05Ref, thumbnail05);  
            if(thumbnail05 !== undefined && thumbnail05 !== "") {  
                uploadTask5.on('state_changed', 
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
                        getDownloadURL(uploadTask5.snapshot.ref).then((downloadURL) => {
                            console.log(downloadURL);
                            updateDoc(newStore, {
                                thumbnail05: downloadURL
                            });
                        });
                    }
                );
            }

            //파일업로드 menu
            const menuRef = ref(storage01, `${folder_name}/menu`);
            const uploadTask_menu = uploadBytesResumable(menuRef, menuImage);  
            if(menuImage !== undefined && menuImage !== "") {  
                uploadTask_menu.on('state_changed', 
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
                        getDownloadURL(uploadTask_menu.snapshot.ref).then((downloadURL) => {
                            console.log(downloadURL);
                            updateDoc(newStore, {
                                menu: downloadURL
                            });
                        });
                    }
                );
            }
            
            navigate(`/detail/${newStore.id}`);
        }//if문 끝 
    }

    const onChange = (event) => {
        event.preventDefault();

        const{
            target : {name, value}
        } = event;

        if(name==="store_name"){ setStoreName(value); }
        if(name==='explanation'){ setExplanation(value); }
        if(name==='store_tel'){ setTel(value); }
        if(name==='store_time'){ setStoreTime(value); }
        if(name==='store_closed'){setClosed(value);}
        if(name==='store_homepage'){setHomepage(value);}
        if(name==='add01'){setAdd01(value);}
        if(name==='add02'){setAdd02(value);}
        if(name === 'direction'){setDirection(value);}
    }  

    const onClick = (event) => {
        const{
            target : {name, value}
        } = event;

        if(name === 'power_socket'){ setSocket(value); }
        if(name === 'big_table'){ setBigTable(value); }
        if(name === 'parking'){ setParking(value); }
        if(name === 'pets'){ setPets(value); }
        if(name === 'full_glass'){ setFullGlass(value); }
        if(name === 'smoking_room'){ setSmoking(value); }
        if(name === 'no_Kids'){ setNoKids(value); }
        if(name === 'sofa'){ setSofa(value); }
        if(name === 'terrace'){ setTerrace(value); }
    } 

    return (
        <div>
           <Header title="매장등록"/>
           <div className="sub_content">
                <form onSubmit={onSubmit}>
                    <div className={styles.title}>장소정보</div>
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>매장명 <b>*</b></div>
                        <input 
                            type="text" 
                            name="store_name" 
                            className={styles.ipt}
                            required
                            value={storeName}
                            onChange={onChange}
                            placeholder="매장명을 입력해주세요." 
                        />
                    </div>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>매장 이미지 등록 #01<b>*</b> <span className={styles.important}>(권장 사이즈 : 1200x500)</span></p>
                        <p>
                            <input 
                                type="file" 
                                name="thumbnail01"
                                className={styles.file} 
                                accept="image/*"
                                onChange={onFileChange}
                                required
                            />
                        </p>
                    </div>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>매장 이미지 등록 #02<b>*</b> <span className={styles.important}>(권장 사이즈 : 1200x500)</span></p>
                        <p>
                            <input type="file" 
                                name = "thumbnail02"
                                className={styles.file} 
                                accept="image/*"
                                onChange={onFileChange}
                            />
                        </p>
                    </div>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>매장 이미지 등록 #03<b>*</b> <span className={styles.important}>(권장 사이즈 : 1200x500)</span></p>
                        <p>
                            <input 
                                type="file" 
                                name = "thumbnail03"
                                className={styles.file} 
                                accept="image/*"
                                onChange={onFileChange}
                            />
                        </p>
                    </div>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>매장 이미지 등록 #04<b>*</b> <span className={styles.important}>(권장 사이즈 : 1200x500)</span></p>
                        <p>
                            <input 
                                type="file" 
                                name="thumbnail04"
                                className={styles.file} 
                                accept="image/*"
                                onChange={onFileChange}
                            />
                        </p>
                    </div>
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>매장 이미지 등록 #05<b>*</b> <span className={styles.important}>(권장 사이즈 : 1200x500)</span></p>
                        <p>
                            <input 
                                type="file" 
                                name="thumbnail05"
                                className={styles.file} 
                                accept="image/*"
                                onChange={onFileChange}
                            />
                        </p>
                    </div>

                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>매장설명</div>
                        <input 
                            type="text" 
                            name="explanation" 
                            className={styles.ipt}
                            value={explanation}
                            onChange={onChange}
                            placeholder="매장설명을 입력해주세요." 
                        />
                    </div>

                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>전화번호</div>
                        <input 
                            type="text" 
                            name="store_tel" 
                            className={styles.ipt}
                            value={tel}
                            onChange={onChange}
                            placeholder="전화번호를 입력해주세요." 
                        />
                    </div>

                    {/* 주소 */}
                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>주소 <b>*</b></div>
                        <input 
                            type="text" 
                            name="add01" 
                            required
                            className={styles.ipt}
                            onChange={onChange}
                            placeholder="주소를 입력해주세요." 
                        />
                        <input 
                            type="text" 
                            name="add02" 
                            required
                            className={styles.ipt}
                            onChange={onChange}
                            placeholder="상세주소를 입력해주세요." 
                        />
                    </div>

                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>영업시간 <b>*</b></div>
                        <textarea 
                            type="text" 
                            name="store_time" 
                            required
                            className={styles.ipt}
                            value={storeTime}
                            onChange={onChange}
                            placeholder="영업시간을 입력해주세요." 
                        ></textarea>
                    </div>

                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>휴무일</div>
                        <textarea 
                            type="text" 
                            name="store_closed" 
                            className={styles.ipt}
                            value={closed}
                            onChange={onChange}
                            placeholder="휴무일을 입력해주세요." 
                        ></textarea>
                    </div>

                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>홈페이지</div>
                        <input 
                            type="text" 
                            name="store_homepage" 
                            className={styles.ipt}
                            value={homepage}
                            onChange={onChange}
                            placeholder="홈페이지 링크를 입력해주세요." 
                        />
                    </div>

                    <div className={styles.ipt_wrap}>
                        <div className={styles.label}>길찾기 링크 </div>
                        <input 
                            type="text" 
                            name="direction" 
                            className={styles.ipt}
                            value={direction}
                            onChange={onChange}
                            placeholder="길찾기 링크를 입력해주세요." 
                        />
                    </div>


                    <StoreRadioWrap title="콘센트" name="power_socket" onClick={onClick}/>
                    <StoreRadioWrap title="큰테이블" name="big_table" onClick={onClick}/>
                    <StoreRadioWrap title="주차장" name="parking" onClick={onClick}/>
                    <StoreRadioWrap title="애견동반" name="pets" onClick={onClick}/>
                    <StoreRadioWrap title="통유리" name="full_glass" onClick={onClick} />
                    <StoreRadioWrap title="흡연실" name="smoking_room" onClick={onClick} />
                    <StoreRadioWrap title="노키즈존" name="no_Kids" onClick={onClick} />
                    <StoreRadioWrap title="쇼파" name="sofa" onClick={onClick} />
                    <StoreRadioWrap title="테라스" name="terrace" onClick={onClick} />
                    
                    <div className={styles.ipt_wrap}>
                        <p className={styles.label}>메뉴판 이미지 등록<b>*</b> <span className={styles.important}>(크기 상관없음)</span></p>
                        <p>
                            <input 
                                type="file" 
                                name="menu"
                                className={styles.file} 
                                accept="image/*"
                                onChange={onFileChange}
                                required
                            />
                        </p>
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
    );
}

export default  StoreRegist;