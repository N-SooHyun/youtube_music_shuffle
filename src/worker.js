let currentTime = 0;
let interval;

onmessage = (e) => {
    if(e.data === "start"){
        interval = setInterval(() => {
            currentTime += 5;
            postMessage(currentTime);   //메인 스레드로 타이머 값을 전달
        }, 5000);
    }else if(e.data === "stop"){
        clearInterval(interval);        //타이머 중지
    }else if(e.data === "reset"){  
        currentTime = 0;                //시간 초기화
    }
}