import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from 'react';

import "./App.css";


// reactの範囲外で扱う手段があってもいい
if (typeof window !== 'undefined') { 

}


function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState({
    hour: new Date().getHours().toLocaleString(),
    minute: new Date().getMinutes().toLocaleString(),
    second: new Date().getSeconds().toLocaleString()
  });
  const [secondDot, setSecondDot] = useState("");
  const [secondArray, setSecondArray] = useState(['']);
  const [secondItems, setSecondItems] = useState([Array(60).fill('')]);

  const [MinuteDot, setMinuteDot] = useState("");
  const [hourDot, setHourDot] = useState("");


  // useEffect 
  // https://ja.react.dev/reference/react/useEffect#my-effect-runs-twice-when-the-component-mounts

  // useEffect(setup

  const [message, setMessage] = useState('');
  useEffect(() => {
    console.log('Component mountedaaaa');
    return () => {
      console.log('Component unmounted');
    }
    // メッセージの値を検知してreactの範囲外で処理を行える
  }, [message])


  async function putmessage(text: string) {
    console.log('putmessage',text);
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setMessage(text);
  }

  useEffect(() => {


    // この部分に初回の一回だけ実行される処理を記述する
    // setSecondArrayに初期血を入れる
    // setSecondArray(['あ','あ','あ','あ','あ','あ','あ','あ','あ','あ','あ','あ']);
    // Clean-up 関数を返すことで、コンポーネントがアンマウントされたときに処理を実行することもできます
    return () => {
      // useeffectの中でreturnするとコンポーネントがアンマウントされたときに実行される
      // つまりこれがクリーンアップ関数
      console.log('Component unmounted');
    };
  }, []); // 空の依存配列を渡すことで初回の一回だけ実行される


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
  },[date])


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
      setSecondArray(['']);
      return
    } 
    setSecondArray(secondArray => [...secondArray, second]);
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

  function seconHtml() {
   return Array.from(new Array(60)).map((v,i) => {
    // 0でリセットしているのでactiveにならない
    if(i === 0) return false
      return <p className={'secondDots ' + (Number(secondArray[i]) === i ? 'active': '')} key={i}> </p>
    })
  }
  
  return (

    <div className="container">
      <div>
        <h3>時間</h3>
        <div>
          <button onClick={(e)=>{
            e.preventDefault();
            putmessage(new Date().getHours().toLocaleString() + ':' + new Date().getMinutes().toLocaleString() + ':' + new Date().getSeconds().toLocaleString());
          }}>Greet</button>
        </div>
        <p>日本:{date.hour}:{date.minute}:{date.second}</p>
        <p>{hourDot}</p>
        <p>{MinuteDot}</p>
        <p>{secondDot}</p>
        <div className="secondContainer">
          <div className="secondContainerTitle">秒</div>
          <div className="secondContainerBody">
            {seconHtml()} 
          </div>
        </div>
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
