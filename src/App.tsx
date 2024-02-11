import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from 'react';

import { isPermissionGranted, requestPermission , sendNotification} from '@tauri-apps/api/notification';



import "./App.css";


// reactの範囲外で扱う手段があってもいい
if (typeof window !== 'undefined') { 

}

async function funcsendNotification() {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  if (permissionGranted) {
    console.log('Permission granted');
    sendNotification('Tauri is awesome!');
    sendNotification({ title: 'TAURI', body: 'Tauri is awesome!', sound: 'purr'});
  }
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
    funcsendNotification();

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

  const [dots, setDots] = useState([]);

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

      // setDots(prevDots => {
      //   const newDots = [...prevDots, time.second];
      //   // ドットが60を超えたらリセット
      //   if (newDots.length > 60) {
      //     return newDots.slice(1);
      //   }
      //   return newDots;
      // });

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

   // スパイラルの座標を計算する関数
   function calculateSpiralPosition(index) {
    const radius = 5 * index; // ドットの間隔を調整
    const angle = index * (Math.PI / 30); // 角度を計算
    const x = radius * Math.cos(angle) + 100; // x座標を計算
    const y = radius * Math.sin(angle) + 100; // y座標を計算
    return { x, y };
  }

  
  return (

    <div className="container">
      <div>
        <div>
          {/* <button onClick={(e)=>{
            e.preventDefault();
            putmessage(new Date().getHours().toLocaleString() + ':' + new Date().getMinutes().toLocaleString() + ':' + new Date().getSeconds().toLocaleString());
          }}>Greet</button> */}
        </div>
        <h1>Time App</h1>
        <p className="time">{date.hour}:{date.minute}:{date.second}:UTC+09:00</p>
        {/* <p>{hourDot}</p>
        <p>{MinuteDot}</p>
        <p>{secondDot}</p> */}
        <div className="secondContainer">
          <div className="secondContainerBody">
            {seconHtml()} 
          </div>
        </div>
        {/* <div className="spiralContainer">
          {dots.map((dot, index) => {
            const position = calculateSpiralPosition(index);
            return (
              <div
                key={index}
                className="dot"
                style={{ left: position.x + 'px', top: position.y + 'px' }}
              ></div>
            );
          })} */}
        {/* </div> */}
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
