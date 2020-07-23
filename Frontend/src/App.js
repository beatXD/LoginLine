import React, { useState, useEffect } from "react";
import "./App.css";

const ngrok = "https://fe5e5a8a3c6f.ngrok.io";
const CLIENT_PORT = "http://localhost:3002";

const App = () => {
  const [data, setData] = useState();

  const [loggedin, setloggedin] = useState(false);

  useEffect(() => {
    console.log("useEffect");
    getdata();
  }, []);

  const login = async () => {
    window.location.href = `${ngrok}/auth/line`;
  };

  const logout = async () => {
    await setloggedin(false);
    window.location.href = `${ngrok}/logout`;
  };

  const getdata = async () => {
    await setloggedin(true);
    const response = await fetch(`${ngrok}/login/success`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": CLIENT_PORT,
      },
    });
    const data = await response.json();
    if (data) {
      await setData(data.user);
    } else {
      await setloggedin(false);
    }
  };

  console.log(loggedin);
  console.log('data',data)

  return (
    <div className="App">
      <header className="App-header">

        <div>
          <div> LOGIN LINE </div>
          <br />
          <div>
            <button onClick={login}> Login </button>
            <button onClick={logout}> logout </button>
          </div>

          <br />

          { loggedin === false
          ? (<div> Please Login ... </div>) 
          : loggedin === true && data !== undefined 
          ? (
            <div>
              <img className="profile" src={data.pictureUrl} />
              <p> ID : {data.id} </p>
              <p> DisplayName : {data.displayName}</p>
              <p> Provider : {data.provider}</p>
            </div>
            ) 
          : (<div> Loading ... </div>) }
        </div>
        
      </header>
    </div>
  );
};

export default App;
