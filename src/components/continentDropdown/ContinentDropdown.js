import React from 'react'; 
import Form from 'react-bootstrap/Form';

import * as styles from './ContinentDropdown.module.scss'; 


const ContinentDropdown = ({ continent }) => {


    const handleChange = (e) =>{
        continent(e.target.value); 
    }


    return (
        <div className={styles.ddWrapper}>
            <Form>
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Select Continent</Form.Label>
                    <Form.Control as="select" onChange={(e) => handleChange(e)}>
                        <option>Choose Option</option>
                        <option>Asia</option>
                        <option>Europe</option>
                        <option>North America</option>
                        <option>South America</option>
                    </Form.Control>
                </Form.Group>
            </Form>
        </div>       
    )
}

export default ContinentDropdown;
