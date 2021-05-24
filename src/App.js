import React, { useState, useEffect } from 'react'; 

import * as Constants from './constants'; 
import * as styles from './App.module.scss';
import RegionBox from './components/regionBox/RegionBox'; 
import AdminPanel from './components/adminPanel/AdminPanel'; 
import Footer from './components/footer/Footer'; 
import Orbitals from '@bit/joshk.react-spinners-css.orbitals';


const body = 
[ 
    {
        "id":"123", 
        "continent":"Europe", 
        "country":"Netherlands",
        "city":"Amsterdam", 
        "utcoffset":"60",
        "openHoursOne":"11:00-14:00",
        "openingHoursTwo":"15:00-17:00" 

    },
    {
        "id":"456", 
        "continent":"Asia", 
        "country":"China",
        "city":"Shanghai", 
        "utcoffset":"480",
        "openHoursOne":"11:00-14:00",
        "openingHoursTwo":"15:00-17:00" 

    }, 
    {
      "id":"5673", 
      "continent":"Asia", 
      "country":"China SAR",
      "city":"Hong Kong", 
      "utcoffset":"480",
      "openHoursOne":"10:00-12:00",
      "openingHoursTwo":"13:00-16:00" 

  }, 
    {
        "id":"789", 
        "continent":"South America", 
        "country":"Brazil",
        "city":"San Paolo", 
        "utcoffset":"180",
        "openHoursOne":"11:00-14:00",
        "openingHoursTwo":"15:00-17:00" 

    }, 

    {
      "id":"1122", 
      "continent":"Europe", 
      "country":"Ukraine",
      "city":"Kyiv", 
      "utcoffset":"60",
      "openHoursOne":"11:00-14:00",
      "openingHoursTwo":"15:00-17:00" 

  }

]

const App = ()  => {

  let uniqueContinents = [];
  let continents = []; 
  //delete this
  let arr = []; 

  const [ showAdminPanel, setshowAdminPanel] = useState(false);
  const [ data, setData ] = useState([]);  
  //const [ loading, setLoading ] = useState(false); 
  
  const showAdminHandler = () => {
    setshowAdminPanel(showAdminPanel => !showAdminPanel); 
  } 


  const fetchData = async(url) => {
    //setLoading(loading => true); 
    //const response = await fetch(url);

    try{
      // const body = await response.json(); 
      // setLoading(loading => false); 
      //for testing single clock
      //arr.push(body.data.Items[1]); 
      //arr.push(body.data.Items[9]); 
      //console.log(body.data.Items[8]); 
      setData(data => body);
      //console.log(data); 
      //setData(data => arr);
    }catch(error){
      console.log('Error happened here!')
      console.error(error); 
    }
     
    //setLoading(true); 
  }




  for (let key in data) {
    continents.push(data[key].continent);    
  }

  uniqueContinents = continents.filter((v, i, a) => a.indexOf(v) === i);

  let regionBox = uniqueContinents.map( cont => 
    <RegionBox 
      key={cont.id} 
      continentName={cont} 
      data={data}/>
  )


  useEffect(() => {
    fetchData(Constants.GET_URL); 
  },[]); 


  return (
    <div className={styles.App}>
      <div className={styles.titleBox}>
        <div className={styles.title} >The Markets Open</div>
      </div>
      <div className={styles.mainContentBox}>

        {/*loading ? <div className={styles.loader}><Orbitals color="rgb(70, 190, 112)" /></div> : regionBox*/}

        {
          uniqueContinents.map( cont => 
            <RegionBox 
              key={cont.id} 
              continentName={cont} 
              data={data}/>
          )
        }
       

        
        <div className={styles.buttonContainer}>
          <button onClick={showAdminHandler}>Admin Panel</button>    
        </div>


          {showAdminPanel && <AdminPanel/>}

      
      </div>

      <Footer/>
    </div>
  );
}

export default App;
