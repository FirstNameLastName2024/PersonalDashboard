/* ###SETUP### */

// CSS methods and variables
const r = document.querySelector(':root');
const rs = getComputedStyle(r); // Get the styles (properties and values) for the root

const updateDegree = (value) =>  r.style.setProperty('--degree', `${value}deg`); 


//DOM ELEMENTS
const timerInputs = [...document.querySelector(".timer").children];
const endTimeElm = document.querySelector(".reminder").children[1];
const controlBtns = [...document.querySelector(".play_pause").children, document.querySelector(".reset")]; // contains play, pause, reset elements


// TIMER CLASS
class Timer{
    constructor(fn){
        //Properties to control the timer
        this.fn = fn;
        this.progress = null;
        this.timer = null;
        //Properties to keep track of the time accuratley
        this.totalTimeSet = null;
        this.timeLeft = 0;
        this.referenceTime = null;
        this.elapsed = null;
        //Audio file and handler
        this.audio = new Audio("alarm.mp3");
        const this_obj = this
        this.audio.addEventListener('ended', function() {
            (this_obj.progress == 2 && this.play())
        });
    };

    updateState(stateName, state){ //null: timer being updated, 0: timer paused, 1: timer running, 2:timer complete
        this[stateName] = state;

        // IF the progress property is updated update display 

        if(stateName == "progress"){
            if(state != 1){ //Everything else other than 1
                clearInterval(this.timer);
                this.timer = null;
            }

            updateDisplay();
            setReadOnly();
        }
    };

    getProperty(value){
        return this[value];
    };


    play(){
        if(this.getProperty("progress") == null){
            this.totalTimeSet = timerInputs[0].value * 3600000 + timerInputs[1].value * 60000 + timerInputs[2].value * 1000;
            this.timeLeft = this.totalTimeSet;
            updateDegree(0);
        };

        this.referenceTime = Date.now();
        setFinishTime();
        this.updateState("progress",1);
        this.timer = setInterval(this.fn);
    };

    pause(){
        this.updateState("progress",0);
        this.timeLeft -= this.elapsed;
    };

    reset(){
        this.updateState("progress", null);
        this.audio.pause();
    };

    complete(){
        this.updateState("progress", 2);
        this.audio.currentTime = 0;
        this.audio.play();
    };
};

const timer = new Timer(updateProgressBar); 



/* ###MANAGE DISPLAY ELELMENTS### */
function updateDisplay(){
    let timer_state = timer.getProperty("progress");
    switch (timer_state){
        case null: //When timer is not in session
            updateDegree(360); 
            endTimeElm.style.visibility = "hidden";    
            timerInputs.map(elm => elm.value = "00");
            controlBtns[2].style.visibility = "hidden";
            controlBtns[0].style.display = "block";
            controlBtns[1].style.display = "none";

            break;
        case 0: // Timer in paused state
            controlBtns[0].style.display = "block";
            controlBtns[1].style.display = "none";
            controlBtns[2].style.visibility = "visible";
            endTimeElm.style.visibility = "visible";    
            break;
        case 1: // Timer in play state
            controlBtns[0].style.display = "none";
            controlBtns[1].style.display = "block";
            endTimeElm.style.visibility = "visible";    
            controlBtns[2].style.visibility = "visible";
            break;
        default: // Default state is complete state
            controlBtns[0].style.display = "none";
            controlBtns[1].style.display = "none";
            break;
    };
};

updateDisplay();




/* ###leading zeros### */
function leadingZeros(timeArray){
    for(let i = 0; i<timeArray.length; i++){
        if (timeArray[i] >=0 && timeArray[i] < 10){
            timeArray[i] = `0${timeArray[i]}`;
        }
    };
    return timeArray;
};

/* ###overflow### */
function timeOverflow(total_time=null){
    total_time = total_time == null? timerInputs[0].value * 3600 + timerInputs[1].value * 60 + timerInputs[2].value * 1:total_time;
    let hours_minutes_seconds = new Array(3);
    
    if (total_time >= 359999){
        hours_minutes_seconds[0] = "99";
        hours_minutes_seconds[1] = "59";
        hours_minutes_seconds[2] = "59";
    }else{
        for(let i =0; i<hours_minutes_seconds.length; i++){
            let exponent = 2 - i;
            hours_minutes_seconds[i] = Math.floor(total_time / (60**exponent));
            total_time -= hours_minutes_seconds[i] * (60**exponent);
        };
    };

    hours_minutes_seconds = leadingZeros(hours_minutes_seconds);
    return hours_minutes_seconds;
};

/* ###FinishTime### */
function setFinishTime(){
    const now = new Date();
    let currentTimeInSeconds = (now.getHours()*3600) + (now.getMinutes() * 60) + now.getSeconds();
    let current_timer_value = timerInputs[0].value * 3600 + timerInputs[1].value * 60 + timerInputs[2].value *1;
    let finishTimeinSeconds = (currentTimeInSeconds  + current_timer_value) % 86400;
    let res = timeOverflow(finishTimeinSeconds);
    endTimeElm.innerText = `${res[0]}:${res[1]}`;
};

/* ###setReadState### */
function setReadOnly(){
    timerState = timer.getProperty("progress");
    timerInputs.map(elm => elm.readOnly = !(timerState == null));  
};

/* ###TIMERPROGRESS### */
function updateProgressBar(){

    console.log('running');
    const currentTime = Date.now();
    const elapsed = (currentTime - timer.getProperty("referenceTime"));
    const time_to_parse = timer.getProperty("timeLeft") - elapsed;
    const angle = ( 1 - (time_to_parse/timer.getProperty("totalTimeSet"))) * 360;
    const parsed_time = timeOverflow(Math.ceil(time_to_parse/1000));
    // Update timer bar
    updateDegree(angle)
    // Update time value
    timerInputs[0].value = parsed_time[0]; 
    timerInputs[1].value = parsed_time[1];
    timerInputs[2].value = parsed_time[2];
    // Update elapsed time from reference point
    timer.updateState("elapsed", elapsed);
    // End condition
    if(time_to_parse < 0){
        timer.complete();
    };
};

// You get elapsed time, and you subtact and store to the set time each time the interval runs, which means you'd have 500 initally, however, over time it would subtract 1, 2, 5, 10, 15....

/* ###EVENT LISTNERS### */
document.addEventListener('click', (e) => {
    let action = e.target.getAttribute('function');
    switch (action){
        case 'play':
            timer.play();
            break;

        case 'pause':
            timer.pause();
            break;
        
        case 'reset':
            timer.reset();
            break;
    };
});

timerInputs.map(elm => elm.addEventListener("focus", () => 
    {
        timerInputs.map((inputElm) => {
            if (inputElm.value){
                inputElm.placeholder = inputElm.value 
                inputElm.value = "";
            }
        });
    }
));

timerInputs.map(elm => elm.addEventListener("focusout", () => 
    {
        timerInputs.map((inputElm) => {
            if (!inputElm.value){
                inputElm.value = inputElm.placeholder 
                inputElm.placeholder = "00";
            };
        });
        let value_to_insert = timeOverflow();
        timerInputs.map((inputElm, index) => {
            inputElm.value = value_to_insert[index];
        });
    }
));