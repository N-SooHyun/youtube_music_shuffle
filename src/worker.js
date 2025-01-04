let TimerInterval;
let currentTime = 0;
let interruptVideo = false;

function startTimer(duration){
    currentTime = 0;
    TimerInterval = setInterval(() => {
        currentTime += 5;
        if(currentTime>=duration){
            postMessage({type: 'timerEnd', currentTime});
            clearInterval(TimerInterval);
        }else if(interruptVideo){
            postMessage({type: 'interruptVideo', currentTime});
            clearInterval(TimerInterval);
            interruptVideo = false;
        }
        else{
            //postMessage({type: 'updateTime', currentTime});
            console.log("currentTime: ",currentTime);
        }
    },5000);
}

function stopTimer() {
    clearInterval(TimerInterval);
}

function cancelTimer(){
    console.log("cancel");
    interruptVideo = true;
}


onmessage = function(e){
    const {type, duration} = e.data;
    if (type === 'start') {
        startTimer(duration);
    } else if (type === 'stop') {
        stopTimer();
    } else if(type === 'cancel'){
        cancelTimer();
    }
};