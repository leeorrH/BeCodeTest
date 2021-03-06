import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';

function NumberInput({ initValue, id, handleChange }) {
    const [value,setValue] = useState(initValue);
    
    const handleNumberChange = (e) => {
        let valueAsInt = parseInt(e.target.value);
        handleChange(valueAsInt, 'value', id);
    }

    return (
        <TextField
            id="filled-number"
            type="number"
            value={value}
            InputLabelProps={{
                shrink: true,
            }}
            variant="filled"
            onChange={(e) => {
                setValue(parseInt(e.target.value));
                handleNumberChange(e);
            }}
        />
    )
}

export default NumberInput
