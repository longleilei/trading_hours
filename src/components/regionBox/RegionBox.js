import React, { useState, useEffect } from 'react'; 
import * as styles from './RegionBox.module.scss'; 
import { AiFillMinusCircle } from 'react-icons/ai'; 
import { AiFillPlusCircle } from 'react-icons/ai'; 

import Clock from '../clock/Clock'; 



const RegionBox = ({ continentName, data }) => {

   
    const [ show, setShow ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(false); 


    const showHandler = () => {
        setShow(show => !show ); 
    }

    const continentMap = (returnArr, mapArr ) => {

        returnArr = (<div className={styles.clockBoxes}>   
            { 
                mapArr.map(el => 
                    
                    <Clock 
                        key={el['id']}
                        regionName={el['country']}
                        cityName={el['city']}
                        utcoffset={el['utcoffset']}
                        openHoursOne={el['openHoursOne']}
                        openHoursTwo={el['openHoursTwo']}
                    />) 
            }
        </div>); 

        return returnArr; 

    }

    //need to optimize this part 
    const renderByContinent = (continentName) =>{

       //mapArr
        let europe = []; 
        let asia = []; 
        let southAmerica = []; 
        let northAmerica = []; 

        //returnArr
        let eur = []; 
        let as = []; 
        let southA = []; 
        let northA = []; 
        
        
        data.forEach(d => {

            if(d.continent === 'Europe'){
                europe.push(d); 
            } else if(d.continent === 'Asia'){
                asia.push(d);
            } else if(d.continent == 'South America'){
                southAmerica.push(d); 
            } else if(d.continent == 'North America'){
                northAmerica.push(d); 
            } 
        }); 

          
        switch(continentName){
            case 'Asia': 
                return continentMap(as, asia);  
            case 'Europe': 
                return continentMap(eur, europe);  
            case 'South America': 
                return continentMap(southA, southAmerica); 
            case 'North America':
                return continentMap(northA, northAmerica);; 
            default: 
                return 0; 
        }
    }


    return (
        <div className={styles.regionBox}>
            <div className={styles.greyStripe}>
                <div className={styles.left}>{continentName}</div>
                <div className={styles.right}>
                    { isLoading && <div>Loading...</div> }
                    { show ?  
                        <AiFillMinusCircle onClick={showHandler}/> : 
                        <AiFillPlusCircle onClick={showHandler}/>
                    }  
                </div>
            </div>
            { show && renderByContinent(continentName)}
            
        </div>
    )
}

export default RegionBox; 
