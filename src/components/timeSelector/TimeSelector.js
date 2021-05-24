import React, { useState } from 'react';

import * as styles from './TimeSelector.module.scss'; 
import TextField from '@material-ui/core/TextField';

const TimeSelector = ({ timeSlotOne, timeSlotTwo }) => {

    const [timeFrom, onChangeTimeFrom] = useState('00:00');
    const [timeTo, onChangeTimeTo] = useState('00:00');

    const [secondTimeFrom, onChangeSecondTimeFrom] = useState('01:00');
    const [secondTimeTo, onChangeSecondTimeTo] = useState('01:00');


    const selectTimeFrom = (e) => {
        onChangeTimeFrom(timeFrom => e.target.value); 
    }

    const selectTimeTo = (e) => {
        onChangeTimeTo(timeTo => e.target.value); 
        timeSlotOne([timeFrom, e.target.value]); 
    }


    const selectSecondTimeFrom = (e) => {
        onChangeSecondTimeFrom(secondTimeFrom => e.target.value); 
    }

    const selectSecondTimeTo = (e) => {
        onChangeSecondTimeTo(secondTimeTo => e.target.value); 
        timeSlotTwo([secondTimeFrom, e.target.value]); 
    }


    return (
    <form className={styles.container} noValidate >

        <TextField
            className={styles.textField}
            id="time"
            label="From"
            type="time"
            value={timeFrom}
            onChange={e => selectTimeFrom(e)}
            InputLabelProps={{
            shrink: true,
            }}
            inputProps={{
            step: 300,// 5 min
            }}
        />
    

        <TextField
            className={styles.textField}
            id="time"
            label="To"
            type="time"
            value={timeTo}
            onChange={e => selectTimeTo(e)}

            InputLabelProps={{
            shrink: true,
            }}
            inputProps={{
            step: 300, // 5 min
            }}
        />

        <div className={styles.divider}> Input Second TimeSlot </div>

        <TextField
            className={styles.textField}
            id="time"
            label="From"
            type="time"
            defaultValue="07:30"
            value={secondTimeFrom}
            onChange={e => selectSecondTimeFrom(e)}
            InputLabelProps={{
            shrink: true,
            }}
            inputProps={{
            step: 300, // 5 min
            }}
        />
    

        <TextField
            className={styles.textField}
            id="time"
            label="To"
            type="time"
            defaultValue="07:30"
            value={secondTimeTo}
            onChange={e => selectSecondTimeTo(e)}

            InputLabelProps={{
            shrink: true,
            }}
            inputProps={{
            step: 300, // 5 min
            }}
        />

    </form>
            
    )
}

export default TimeSelector; 
