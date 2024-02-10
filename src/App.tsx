import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from 'react';

import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState({
    hour: new Date().getHours().toLocaleString(),
    minute: new Date().getMinutes().toLocaleString(),
    second: new Date().getSeconds().toLocaleString()
  });
  const [secondDot, setSecondDot] = useState("");
  const [MinuteDot, setMinuteDot] = useState("");
  const [hourDot, setHourDot] = useState("");





  useEffect(() => {
    // new Date().getUTCMilliseconds() に関する情報
    // https://lsd-blog.com/js-just-time/
    const interval = setInterval(() => {
      const time = getTime();
      setDate({
        hour: time.hour,
        minute: time.minute,
        second: time.second
      })
      mathSecond(time.second);
      mathMinute(time.second,time.minute);
      mathHour(time.second,time.minute,time.hour);
    },1000 - new Date().getUTCMilliseconds()); 
    return () => clearInterval(interval);
  })


  function getTime() {
    const date = new Date();
    const hour = date.getHours().toLocaleString();
    const minute = date.getMinutes().toLocaleString();
    const second = date.getSeconds().toLocaleString();
    return { hour, minute, second }
  }


  function mathSecond(second: string) {
    // 60秒でリセット
    if (Number(second) === 0) {
      setSecondDot("");
      return
    } 
    setSecondDot(secondDot => secondDot +"s");
    
  }

  function mathMinute(second:string ,minute: string) { 
    // 60分でリセット
    if(Number(second) === 0 && Number(minute) === 0) {
      setMinuteDot("");
      return
    }
    if(Number(second) === 0 ) {

      setMinuteDot(MinuteDot => MinuteDot +"m");
      return
    }

  }

  function mathHour(second:string ,minute: string, hour: string) {
    // 1時間でリセット
    if(Number(second) === 0 && Number(minute) === 0 && Number(hour) === 0) {
      setMinuteDot("");
      return
    }

    if(Number(second) === 0 && Number(minute) === 0 ) {
      setHourDot(hourDot => hourDot +"h");
      return
    }
  }


  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>
      <div>
        <h3>時間</h3>
        <p>日本:{date.hour}:{date.minute}:{date.second}</p>
        <p>{hourDot}</p>
        <p>{MinuteDot}</p>
        <p>{secondDot}</p>
      </div>



      {/* <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>

      <p>{greetMsg}</p> */}
    </div>
  );
}

export default App;
