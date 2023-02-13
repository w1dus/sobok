
import { BrowserRouter, Routes, Route, useLocation} from "react-router-dom";

//route page
import Auth from "routes/Auth";
import CheckCoupon from "routes/CheckCoupon";
import Detail from "routes/Detail";
import EditMember from "routes/EditMember";
import Review from "routes/Review";
import Home from "routes/Home";
import JoinAgree from "routes/JoinAgree";
import MemberWithdrawal from "routes/MemberWithdrawal";
import MemberWithdrawalComplete from "routes/MemberWithdrawalComplete";
import Mypage from "routes/Mypage";
import News from "routes/News";
import ReviewWrite from "routes/ReviewWrite";
import Shipping from "routes/Shipping";
import SignUp from "routes/SignUp";
import SignupComplete from "routes/SignupComplete";
import Stamp from "routes/Stamp";
import StampApplication from "routes/StampApplication";
import StampList from "routes/StampList";
import StampModify from "routes/StampModify";
import StampView from "routes/StampView";
import Store from "routes/Store";
import StorekeeperRegist from "routes/StorekeeperRegist";
import StoreRegist from "routes/StoreRegist";
import StoreRegistResult from "routes/StoreRegistResult";
import Event from "routes/Event";
import ItemRegist from "routes/ItemRegist";
import NewsWrite from "routes/NewsWrite";
import EventRegist from "routes/EventRegist";


import StampIssued from "routes/StampIssued";
import StampAccumulate from "routes/StampAccumulate";
import Apply from "routes/Apply";
import Apply_admin from "routes/Apply_admin";
import { useEffect } from "react";

const ScrollToTop = () => {
    const {pathname} = useLocation(); 
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])

    return null;
}
const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {

    return(
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <Routes>
                <Route exact path="/signup" element={<SignUp />} /> 
                <Route exact path="/join_agree" element={<JoinAgree />} />
                <Route exact path="/signup_complete" element={<SignupComplete />} />

                <Route exact path="/storekeeper_regist" element={<StorekeeperRegist userObj={userObj}/>} />
                <Route exact path="/storeregist_result" element={<StoreRegistResult />} />

                <Route exact path="/mypage" element={<Mypage userObj={userObj} refreshUser={refreshUser}/>} />
                <Route exact path="/store_regist" element={<StoreRegist />} />
                <Route exact path="/detail/:id" element={<Detail userObj={userObj}/>} />
                <Route exact path="/editmember" element={<EditMember userObj={userObj} refreshUser={refreshUser}/>} />

                <Route exact path="/member_withdrawal" element={<MemberWithdrawal />} />
                <Route exact path="/member_withdrawal_complete" element={<MemberWithdrawalComplete />} />
                
                <Route exact path="/stamp" element={<Stamp userObj={userObj}/>}   />
                <Route exact path="/stamp_application" element={<StampApplication/>} />
                <Route exact path="/stamp_modify" element={<StampModify />} />
                <Route exact path="/stamp_list" element={<StampList/>} />
                <Route exact path="/stamp_view" element={<StampView/>} />
                <Route exact path="/check_cupon" element={<CheckCoupon/>} />
                <Route exact path="/shipping" element={<Shipping userObj={userObj}/>} />

                <Route exact path="/review_write/:id" element={<ReviewWrite userObj={userObj}/>} />

                <Route exact path="/store" element={<Store/>} />

                <Route exact path="/review" element={<Review/>} />

                <Route exact path="/news" element={<News/>} />
                <Route exact path="/news_write/:id" element={<NewsWrite />}></Route>


                <Route exact path="/event" element={<Event/>} />
                <Route exact path="/event_regist" element={<EventRegist/>} />

                <Route exact path="/item_regist" element={<ItemRegist />}></Route>

                <Route exact path="/stamp_issue" element={<StampIssued userObj={userObj}/>} />
                <Route exact path="/stamp_accumulate" element={<StampAccumulate userObj={userObj}/>} />
                <Route exact path="/apply_admin" element={<Apply_admin userObj={userObj} />}></Route>
                <Route exact path="/apply" element={<Apply userObj={userObj} />}></Route>


                {
                    isLoggedIn 
                    ? ( <Route exact path="/" element={<Home userObj={userObj}/>} /> ) 
                    : ( <Route exact path="/" element={<Auth />} /> )
                }
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter; 