import React, { useState } from 'react';
import './LoginSignup.css';

const LoginSignup = () => {
  const [state, setState] = useState("Login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: ""
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async () => {
    console.log("login executed", formData);
    let responsedata;
  
    await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => responsedata = data);
  
    if (responsedata.success) {
      localStorage.setItem('auth token', responsedata.token);
      window.location.replace("/");
    }
    else {
      alert(responsedata.errors); 
    }
  };
  

  const signup = async () => {
    console.log("signup executed", formData);
    console.log("login executed", formData);
    let responsedata;

    await fetch('http://localhost:4000/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => responsedata = data);

    if (responsedata.success) {
      localStorage.setItem('auth token', responsedata.token);
      window.location.replace("/");
    }
    else{
      alert(responsedata.error)
    }
  };

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign-up" && 
            <input name="username" value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />}
          <input name="email" value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name="password" value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={() => {
          state === "Login" ? login() : signup();
        }}>Continue</button>

        {state === "Sign-up" ? (
          <p className="loginsignup-login">
            Already have an account? 
            <span onClick={() => setState("Login")}> Login Here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account? 
            <span onClick={() => setState("Sign-up")}> Sign Up Here</span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" />
          <p>By continuing I agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;

