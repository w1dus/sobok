import { useEffect, useState } from 'react';
import AppRouter from "components/Router";
import {authService} from "fbase";
import "components/App.css";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);



  useEffect(() => {

    authService.onAuthStateChanged((user) => {
      if(user){
          setUserObj({
            uid:user.uid,
            displayName: user.displayName,
            email: user.email,
            updateProfile : (args) => user.updateProfile(args),

          });
      } else {
        setUserObj(false);
      }
      setInit(true);
    });
  },
  [])

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      email : user.email,
      updateProfile: (args) => user.updateProfile(args),
    });
    
  }

  return (
    <>
      {init ? 
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} refreshUser={refreshUser}/>
         : 
         'initializing...'
      }
    </>
  );
}

export default App;
