import React, { useState } from 'react'; 
import { CountryDropdown, RegionDropdown, CountryRegionData } from 'react-country-region-selector';


const GeoSelector = ({ geo }) => {

    const [ geoCountry, setGeoCountry ] = useState(''); 
    const [ geoCity, setGeoCity ] = useState(''); 



    const selectCountry = (val) => {
        setGeoCountry(geoCountry => val); 
    }

    const selectRegion = (val) => {
        setGeoCity(geoCity => val);
        geo([geoCountry, val]); 
    }


   

    return (
        <div>

            <CountryDropdown 
                value={geoCountry}
                onChange={val => selectCountry(val)}
                //onChange={(e) => selectCountry(e)}

                style={{ color: 'grey', fontSize: '17px', height: '40px'}}
                >{geoCountry}</CountryDropdown>

            <RegionDropdown 
                country={geoCountry}
                value={geoCity}
                //onChange={(e) => selectRegion(e)}
                onChange={val => selectRegion(val)}

                style={{ color: 'grey', fontSize: '17px', height: '40px', boxShadow: 'grey'}}
                blankOptionLabel="No country selected"
                defaultOptionLabel="Now select a region"
                >{geoCity}</RegionDropdown>   

 
        </div>
    )
}

export default GeoSelector; 
