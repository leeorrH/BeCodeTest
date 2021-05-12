import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    selectInput : {
        bottom: -9
    }
}));

function SelectDrop({initialTestName, handleChange, id}) {
    const classes = useStyles();
    const [testName, setTestName] = useState(initialTestName);

    const handleTestChange = (event) => {
        let name = event.target.value;
        setTestName(name);
        handleChange(name, 'name', id);
    };
    const testNames = [
        'Glucose (B)',
        'HbA1c',
        'Cholesterol',
        'Triglycerides',
        'HDL-Cholesterol',
        'Non-HDL Cholesterol',
        'Protein Total (B)',
        'Albumin (B)'
    ];

    return (
        <Select
            value={testName}
            onChange={handleTestChange}
            className ={classes.selectInput}
        >
            {testNames.map(name =>
                <MenuItem key={name} value={name}>{name}</MenuItem>
            )}
        </Select>
    )
}

export default SelectDrop
