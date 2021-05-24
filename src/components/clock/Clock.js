import React, { useState, useEffect, useRef } from 'react'; 
import { Overlay, Popover } from 'react-bootstrap';

import './Clock.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';



const Clock = ({ regionName, cityName, utcoffset, openHoursOne, openHoursTwo }) => {

    const date = new Date;
    const localUTC = date.getTimezoneOffset();

    let utcDiff = Math.abs(localUTC/60) - (utcoffset/60); 
    let breakStatus = false; 
    let opHoursOne = false; 
    let opHoursTwo = false; 
    

    const initialState = { secondRatio: 0, minuteRatio: 0, hourRatio: 0 }; 
    
    const [ clockState, setClockState ] = useState(initialState);
    const [ time, setTime ] = useState(0);  
    const [ dayTimeStr, setDayTimeStr ] = useState('');
    const [ hoursClosedFriday, setHoursClosedFriday ] = useState(false); 
    const [ hoursOpen, setHoursOpen ] = useState(false); 
    

    //for bs popup 
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    
    
    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };


    const calculateUniversalUTC = () => {

        //returns local date from where the app is used 
        let date = new Date;    
        //console.log(date); 
    
        //offcet taken at the place where app is used 
        let app_utc_offcet = date.getTimezoneOffset(); //returns -480 

        //this is the abstract date according to UTC
        date.setHours(date.getHours() + (app_utc_offcet/60)); 
        //console.log('ABSTRACT TIME', date); 

        return date; 
    }

    const calculateCurrentLocalDate = () => {

        let utcdate = calculateUniversalUTC(); 
        //console.log("UTCDATE" + utcdate); 

        //calculate time according to offcet of the country
        utcdate.setHours(utcdate.getHours() + (utcoffset/60)); 
        //console.log('SHANGHAI TIME', utcdate); 

        return utcdate; 

    }

    const formatDate = (date) => {
        let d = new Date(date); 

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
    }

    const checkSingleDigit = (time) => {
        if(String(+time).charAt(0) == time){
            time = '0' + time; 
        }
        return time; 
    }



    const digitalClockConverter = (date) => {

        
        //getting day of the week 
        const days = ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'];
        let dayNum = Number(date.getDay()); 
        let stsDay = days[dayNum]; 
        

        //getting hours in am/pm 
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours + ':' + minutes + ' ' + ampm;
        
        let timeStr = stsDay + ' ' + strTime;

        setDayTimeStr( dayTimeStr => timeStr); 
        
    } 
  

    const clockStateHandler = (date) => {
        
        let secondRatio = date.getSeconds() / 60; 
        let minuteRatio = (secondRatio + date.getMinutes()) / 60; 
        let hourRatio = (minuteRatio + date.getHours()) / 12;  
    
        setClockState({...clockState, secondRate: secondRatio, minuteRate: minuteRatio, hourRate: hourRatio});

    }

    const clockHandler = () => {

        
        let currentDate = calculateCurrentLocalDate(); 
    
        clockStateHandler(currentDate); 
        digitalClockConverter(currentDate);


    }

    const calculateLocalTime = (openHours) => {



        let hoursFrom = Number(openHours.split('-')[0].slice(0,2)) + utcDiff; 
        let hoursTo = Number(openHours.split('-')[1].slice(0,2)) + utcDiff;
        
        
        if(hoursTo > 24){
            hoursTo = hoursTo%24; 
        }

        checkSingleDigit(hoursFrom); 
        checkSingleDigit(hoursTo); 
        
        return { hoursFrom, hoursTo }; 
        
    }

    const calculateRemainingTime = (endtime) => {
        
        let hourWithDiff = new Date().getHours()-utcDiff; 
        let date = new Date(); 

        //let dateInCountry = ''; 

        //check if day in appRegion is the same as date in country
        // if(date.getDate() === calculateCurrentLocalDate().getDate() ){
        //     dateInCountry = `${date.toDateString()} ${Math.abs(hourWithDiff)}:${date.getMinutes()}:${date.getSeconds()}`; 
        // } else { 
        //     dateInCountry = `${calculateCurrentLocalDate().toDateString()} ${calculateCurrentLocalDate().getHours()}:${date.getMinutes()}:${date.getSeconds()}`;  
        // }

        let dateInCountry = `${calculateCurrentLocalDate().toDateString()} ${calculateCurrentLocalDate().getHours()}:${date.getMinutes()}:${date.getSeconds()}`;  


        //let dateInCountry = `${date.toDateString()} ${Math.abs(hourWithDiff)}:${date.getMinutes()}:${date.getSeconds()}`; 
        //console.log(dateInCountry); 
        //console.log(endtime); 

        const total = Date.parse(endtime) - Date.parse(dateInCountry);
        const seconds = Math.floor( (total/1000) % 60 );
        const minutes = Math.floor( (total/1000/60) % 60 );
        const hours = Math.floor( (total/(1000*60*60)) % 24 );
        const days = Math.floor( total/(1000*60*60*24) );

        return [days,checkSingleDigit(hours),checkSingleDigit(minutes),checkSingleDigit(seconds)]; 
    }

    const calculateUntilClose = () => {

        let endtime = ''; 

       

        //dublication 
        const month = new Date().getUTCMonth(); 
        const day = new Date().getUTCDate();
        const year = new Date().getUTCFullYear();

       
        

        if(checkVal(openHoursTwo)){ 
            if(opHoursTwo){        
                let hTo = `${openHoursTwo.split('-')[1].slice(0,2)}`;
                endtime = new Date(year, month, day, hTo.slice(0,2), 0, 0, 0); 
                const [ds, hs, ms, ss] = calculateRemainingTime(endtime); 
                return `${hs}:${ms}:${ss}`; 
            } else {
                endtime = new Date(year, month, day, openHoursOne.split('-')[1].slice(0,2), openHoursOne.split('-')[1].slice(3,5), 0);
                const [ds, hs, ms, ss] = calculateRemainingTime(endtime); 
                return `${hs}:${ms}:${ss}`; 
            }


        } else { 
            endtime = new Date(year, month, day, openHoursOne.split('-')[1].slice(0,2), openHoursOne.split('-')[1].slice(3,5), 0); 
            const [ds, hs, ms, ss] = calculateRemainingTime(endtime); 
            return `${hs}:${ms}:${ss}`; 
            

        }

    }
    

    const calculateUntilOpen = () => {

        let endtime = new Date(); 
        


        //dublicates 
        const month = endtime.getUTCMonth(); 
        const day = endtime.getUTCDate();
        const year = endtime.getUTCFullYear();
        let hFrom = `${openHoursOne.split('-')[0]}`;

        const seconds = Math.floor( (endtime/1000) % 60 );
        const minutes = Math.floor( (endtime/1000/60) % 60 );
        const hours = Math.floor( (endtime/(1000*60*60)) % 24 );
        const days = Math.floor( endtime/(1000*60*60*24) );

        endtime = new Date(year, month, day, hFrom.slice(0,2), 0, 0, 0); 

        

        //on Friday when it's closed already, we add + 2 days to get to Monday (get endtime)
        if(hoursClosedFriday){
            const numberOfDaysToAdd = 3;
            endtime.setDate(endtime.getDate() + numberOfDaysToAdd); 
        } else if (endtime.getDay() == 6){ //check if Saturday 
            const numberOfDaysToAdd = 2;
            endtime.setDate(endtime.getDate() + numberOfDaysToAdd); 
        } else if(endtime.getDay() == 0) { 
            const numberOfDaysToAdd = 1;
            endtime.setDate(endtime.getDate() + numberOfDaysToAdd); 
        } else {
            endtime.setDate(endtime.getDate()); 
        }

        endtime = `${endtime.toDateString()} ${Number(openHoursOne.split('-')[0].slice(0,2))}${openHoursOne.split('-')[0].slice(2,5)}:00`;        

        const [ds, hs, ms, ss] = calculateRemainingTime(endtime); 

        //avoid -1 day 
        if(ds === -1){
            let endtim = new Date(); 
            const day = endtim.getUTCDate()+1;
            endtim = new Date(year, month, day, hFrom.slice(0,2), 0, 0, 0); 
            endtim = `${endtim.toDateString()} ${Number(openHoursOne.split('-')[0].slice(0,2))}${openHoursOne.split('-')[0].slice(2,5)}:00`; 
            const [ds, hs, ms, ss] = calculateRemainingTime(endtim); 
            return `${ds}d ${hs}:${ms}:${ss}`;

        }
        

        return `${ds}d ${hs}:${ms}:${ss}`; 


    }

    const calculateInBreak = () => {

        if(checkVal(openHoursTwo)){
            const timeNow = calculateCurrentLocalDate(); 
            let hoursOneTo = calculateLocalTime(openHoursOne)['hoursTo']; 
            let hoursTwoFrom = calculateLocalTime(openHoursTwo)['hoursFrom']; 
            let timeString = `${timeNow.getHours()}:${timeNow.getMinutes()}`; 
            
            let buttonStatus = ''; 
    
            buttonStatus = timeString < `${hoursTwoFrom}:00` && timeString > `${hoursOneTo}:00` 
            ? true : false; 
    
            return buttonStatus; 
        }

        return 0; 

        
    }

    const calculateUntilReopen = () => {

 
        //get timeNow and endTime 
        const timeNow = calculateCurrentLocalDate();
        let hoursTwoFrom = calculateLocalTime(openHoursTwo)['hoursFrom']; 
       
        //create proper date objects for difference 
        const month = timeNow.getUTCMonth() + 1; 
        const day = timeNow.getUTCDate();
        const year = timeNow.getUTCFullYear();


        let hoursOneTo = new Date(year, month, day, hoursTwoFrom, 0, 0, 0); 
        let diff = hoursOneTo - timeNow; 

        //dublicate
        const seconds = Math.floor( (diff/1000) % 60 );
        const minutes = Math.floor( (diff/1000/60) % 60 );
        const hours = Math.floor( (diff/(1000*60*60)) % 24 );

        return `${checkSingleDigit(hours)}:${checkSingleDigit(minutes)}:${checkSingleDigit(seconds)}`; 

    }

  

    const handleOpenButton = () => {


        //get current local time
        let currentLocalTime = calculateCurrentLocalDate(); 
        //console.log(currentLocalTime); 

        let formattedDate = formatDate(currentLocalTime); 
        
        //const timeNow = new Date(); 
        
        
        let startTime = openHoursOne.split('-')[0]; 
        let endTime = openHoursOne.split('-')[1]; 

        let startTimeTwo, endTimeTwo, startTimeObjTwo, endTimeObjTwo; 

        if(checkVal(openHoursTwo)){
            startTimeTwo = openHoursTwo.split('-')[0]; 
            endTimeTwo = openHoursTwo.split('-')[1];
            startTimeObjTwo = new Date(`${formattedDate} ${startTimeTwo}`); 
            endTimeObjTwo = new Date(`${formattedDate} ${endTimeTwo}`);
        }
        


        let startTimeObj = new Date(`${formattedDate} ${startTime}`); 
        let endTimeObj = new Date(`${formattedDate} ${endTime}`);
       

        let open = ''; 

        //check if it's Saturday or Sunday 
        if(currentLocalTime.getDay() == 6 || currentLocalTime.getDay() == 0){
            open = (<div className="oval red">Closed</div>); 
            

        } else {
            
            //check if openHoursTwo!=undefined => we have time with the break 
            //otherwise we have only open and close
            if(checkVal(openHoursTwo)){
                if(currentLocalTime < endTimeObj && currentLocalTime > startTimeObj){
                    open = (<div className="oval green">Open</div>); 
                    opHoursOne = true; 
                } else if(currentLocalTime > endTimeObj && currentLocalTime < startTimeObjTwo){
                    opHoursOne = false; 
                    breakStatus = true; 
                    open = (<div className="oval yellow">Break</div>); 
                } else if(currentLocalTime > startTimeObjTwo && currentLocalTime < endTimeObjTwo){
                    breakStatus = false;
                    opHoursTwo = true; 
                    open = (<div className="oval green">Open</div>); 
   
                } else {       
                    open = (<div className="oval red">Closed</div>) 
                }
            } else {
                if(currentLocalTime < endTimeObj && currentLocalTime > startTimeObj ){
                    open = (<div className="oval green">Open</div>); 
                    opHoursOne = true; 
                } else {
                    open = (<div className="oval red">Closed</div>); 
                }
            }

        }
            
         
        return open;  
    }
    const checkVal = val => {
        if((val === 'undefined') || (!val || val.length === 0)){
            return false; 
        }
        return true; 
        
    }


     
    useEffect(() => {
        //console.log('CITYNAME', cityName); 
        const interval = setInterval(() => {
            clockHandler();
            setTime(Date.now())    
        }, 1000); 
       
        return () => {
            clearInterval(interval);
        };
    
        
    }, [time]); 


    // console.log(opHoursOne)
    // console.log(opHoursTwo)

    

    return (
        <div className="mainContainer">
            <div className="top">
                <div className="mainFont">{cityName}</div>
                <div className="secondaryFont">{regionName.toUpperCase()}</div>
                <div className="mainFont">{dayTimeStr}</div>
            </div>

            <div className="middle">
                <div className="clock">
                    <div className="hand hour" 
                        style={{transform: `translate(-50%) rotate(${clockState.hourRate * 360}deg)`}}>
                    </div>
                    <div className="hand minute"
                        style={{transform: `translate(-50%) rotate(${clockState.minuteRate * 360}deg)`}}>
                    </div>
                    <div className="hand second"
                        style={{transform: `translate(-50%) rotate(${clockState.secondRate * 360}deg)`}}>
                    </div>

                    <div className="number number1">
                        <div>1</div>
                    </div>

                    <div className="number number2">
                        <div>2</div>
                    </div>

                    <div className="number number3">
                        <div>3</div>
                    </div>

                    <div className="number number4">
                        <div>4</div>
                    </div>

                    <div className="number number5">
                        <div>5</div>
                    </div>

                    <div className="number number6">
                        <div>6</div>
                    </div>

                    <div className="number number7">
                        <div>7</div>
                    </div>

                    <div className="number number8">
                        <div>8</div>
                    </div>

                    <div className="number number9">
                        <div>9</div>
                    </div>

                    <div className="number number10">
                        <div>10</div>
                    </div>

                    <div className="number number11">
                        <div>11</div>
                    </div>

                    <div className="number number12">
                        <div>12</div>
                    </div>
                </div>
            </div>

            <div className="bottom">
                <div>

                    {handleOpenButton()}

                </div>
                <div className="addInfo">
                    {/* {breakStatus ? <div>{calculateUntilReopen()} until re-open</div> : null} */}
                    
                    <div>{ (opHoursOne || opHoursTwo) ? (`${calculateUntilClose()} until close`) : (breakStatus ? (`${calculateUntilReopen()} until re-open`) : (`${calculateUntilOpen()} until open` )) }</div>
                </div>

                <div ref={ref}>
                    
                    <div className="oval2" onClick={handleClick}>Show Open/Close Hours</div>

                    <Overlay show={show} target={target} placement="top" containerPadding={20}>
                        <Popover id="popover-contained">
                            <Popover.Content>

                                <div class="contentBox">
                                    <div class="shedule">
                                        <div>{cityName.toUpperCase()} TIME</div>
                                        <div>{openHoursOne}</div>
                                        {( typeof openHoursTwo != 'undefined') && (<div>{openHoursTwo}</div>)}
                                    </div>
                                    <div class="shedule">
                                        <div>LOCAL TIME</div>
                                        <div>{`${checkSingleDigit(calculateLocalTime(openHoursOne)['hoursFrom'])}:${openHoursOne.split('-')[0].slice(3,5)} - ${checkSingleDigit(calculateLocalTime(openHoursOne)['hoursTo'])}:${openHoursOne.split('-')[1].slice(3,5)}`}</div>
                                        { checkVal(openHoursTwo) ?  
                                        (<div>{`${checkSingleDigit(calculateLocalTime(openHoursTwo)['hoursFrom'])}:${openHoursTwo.split('-')[0].slice(3,5)} - ${checkSingleDigit(calculateLocalTime(openHoursTwo)['hoursTo'])}:${openHoursTwo.split('-')[1].slice(3,5)}`}</div>):null}
                                    </div>  
                                </div>
                                
                            </Popover.Content>
                        </Popover>
                    </Overlay>
                </div>               
            </div>            
        </div>
    )
}

export default Clock; 
