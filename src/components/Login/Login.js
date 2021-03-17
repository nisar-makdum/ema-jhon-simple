import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManager';



function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    password:'',
    photo: ""
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }
  
  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res, false);
    })
  }

  const handleResponse = (res, redirect) => {
    setUser(res);
      setLoggedInUser(res);
      if(redirect){
        history.replace(from);
      }
  }
  
    
  
  const handleBlur = (e) => {
    let isFieldValid = true;
    if(e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = (isPasswordValid && passwordHasNumber);
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  } 
  const handleSubmit = (e) => {
    if(newUser && user.email && user.password){
      createUserWithEmailAndPassword(user.name, user.email, user.password)
      .then(res =>{
        handleResponse(res, true);
      })
    }
    
    if(!newUser && user.email && user.password){
      signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        handleResponse(res, true);
        })
      }
       
    e.preventDefault();
  
  }
  

  return (
    <div style={{textAlign:'center'}}>
      {
        user.isSignedIn ? <button onClick={signOut}>Sign out</button> :
        <button onClick={googleSignIn}>Sign in</button>
      }
      <button onClick={fbSignIn}>Sign In Using Facebook</button>
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""></img>
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUSer">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Your Name"/>}
        <br/>
        <input type="text" name="email" onBlur={handleBlur} placeholder="Your Email Address" required/>
        <br/>
        <input type="password" name="password" onBlur={handleBlur} placeholder="Password" id="" required/>
        <br/>
        <input type="submit" value={newUser ? 'sign up' : 'sign in'}/>
      </form>
      <p style={{color:'red'}}>{user.error}</p>
      {user.success &&  <p style={{color:'green'}}>{user.error}User {newUser ?'Created' : 'logged in'} Successfully</p>}
    </div>
  );
}

export default Login;
