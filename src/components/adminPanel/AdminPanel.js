import React, { useEffect, useState } from 'react'; 


import ContinentDropdown from '../continentDropdown/ContinentDropdown'; 
import GeoSelector from '../geoSelector/GeoSelector';
import TimeSelector from '../timeSelector/TimeSelector'; 
import * as Constants from '../../constants'; 
import * as styles from './AdminPanel.module.scss'; 

const AdminPanel = () => {

    //const initialFormData = { continent: '', country: '', city: '', timeSlotOne: {from: '', to: ''}, timeSlotTwo: {from: '', to: ''}}; 
    const [ formData, setFormData ] = useState({ continent: '', country: '', city: '', utcoffset: ''}); 
    const [ timeSlotOne, setTimeSlotOne ] = useState({ from: '', to: ''}); 
    const [ timeSlotTwo, setTimeSlotTwo ] = useState({ from: '', to: ''}); 

    

    const postData = async(url) => {

        const info = {
                    "id": `${Math.floor(Math.random() * 1000001)}`, 
                    "continent": formData.continent, 
                    "country": formData.country,
                    "city": formData.city, 
                    "utcoffset": `${formData.utcoffset*60}`,
                    "openHoursOne": `${timeSlotOne.from}-${timeSlotOne.to}`,
                    "openHoursTwo": `${timeSlotTwo.from}-${timeSlotTwo.to}`
                }

        // const bod = {
        //     "id":"56100", 
        //     "continent": "Europe", 
        //     "country": "Ukraine",
        //     "city": "", 
        //     "utcoffset":"+180",
        //     "openHoursOne": "15:00-17:00",
        //     "openHoursTwo": ""
        // }; 

        // const response = await fetch(url, {
        //     method: 'POST',
        //     mode: 'cors',  
        //     headers: { 'Content-Type': 'application/json' }, 
        //     body: JSON.stringify(info) 
        // }); 

        // return response.json(); 

    }

    const handlePost = () => {
        postData(Constants.POST_URL).then(data => console.log(data)); 
    }





    return (
        <div className={styles.mainContainer}>
            <div className={styles.contentBox}>

                <ContinentDropdown continent={selectedContinent => setFormData({...formData, continent: selectedContinent})}/>
                
                <div className={styles.input}>
                    <div className={styles.input}>Choose country and region</div>
                    <GeoSelector 
                        geo={selectedGeo => setFormData({...formData, country: selectedGeo[0], city: selectedGeo[1]})}/>
                </div>

                <div className={styles.input}>
                    <div className={styles.input}>If there is more than one slot, input one more time slot of opening hours</div>
                    <TimeSelector
                        timeSlotOne={selectedTimeSlotOne => setTimeSlotOne({ ...timeSlotOne, from: selectedTimeSlotOne[0], to: selectedTimeSlotOne[1]})}
                        timeSlotTwo={selectedTimeSlotTwo => setTimeSlotTwo({ ...timeSlotTwo, from: selectedTimeSlotTwo[0], to: selectedTimeSlotTwo[1]})}/>
                </div>

                <div className={styles.input}>
                    <div>Enter UTC offcet (consider inputing with (+/-) value)</div>
                    <input type="text" placeholder="UTC offset" onChange={e => setFormData({...formData, utcoffset: e.target.value })}/>
                </div>

                <div className={styles.submitBox}>
                    <button className={styles.submitBtn} onClick={handlePost}>Submit</button>
                </div>
                
            </div> 
        </div>
    )
}

export default AdminPanel; 
