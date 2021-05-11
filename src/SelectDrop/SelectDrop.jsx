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
}));

function SelectDrop({initialTestName, handleChange, id}) {
    const classes = useStyles();
    const [testName, setTestName] = useState(initialTestName);

    const handleTestChange = (event) => {
        setTestName(event.target.value);
        handleChange(event, 'name', id);
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
        >
            {testNames.map(name =>
                <MenuItem key={name} value={name}>{name}</MenuItem>
            )}
        </Select>
    )
}

export default SelectDrop
