import React, { useState, useEffect, useCallback } from 'react';
import DatePicker from '../DatePicker/DatePicker';
import SelectDrop from '../SelectDrop/SelectDrop';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import NumberInput from '../NumberInput/NumberInput';
import SpinnerLoader from '../SpinnerLoader/SpinnerLoader';
import axios from 'axios';


const baseUrl = 'https://becode-interviews.herokuapp.com';
const baseConfig = {
    headers: {
        'AUTH-ID': 'W20EAKOJ42O1V7K1NCVI'
    }
}
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    tableContainer: {
        maxWidth: '80%',
        margin: 'auto'
    },
    addBtn: {
        margin: 10,
        float: 'right'
    }
});

const formateDate = (date = undefined) => {
    let currentDate = date ? date : new Date();
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate);
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(currentDate);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
    return (`${year}-${month}-${day}`);
}
const initialRowState = {
    id: '',
    name: '',
    test_date: formateDate(),
    value: 0
};

function TestTable() {
    const [keyDictionary, setDictionary] = useState([]);
    const [count,setCount] = useState(0);
    const classes = useStyles();
    const [tests, setTests] = useState([]);
    const [rowData, setRowData] = useState(initialRowState);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewRow, setIsNewRow] = useState(false);

    const validateRowData = useCallback(() => {
        let isValid = false;
        if (rowData.value && rowData.test_date != '' && rowData.name != '') {
            isValid = true;
        }
        return isValid;
    });

    useEffect(() => {
        axios.get(`${baseUrl}/blood_tests`, baseConfig).then(result => {
            console.log("comp render");
            if (result != null && Array.isArray(result.data)) {
                let keyValue = result.data.map((test) =>{
                    setCount(count+1);
                   return ({ key: `test-${count}`, value: test.id });
                });
                setDictionary(keyValue);
                setIsLoading(false);
                setTests(result.data);
            }
            else {
                console.log('results returs as : ', result);
            }
        })
        return () => {
            //cleanup
        }
    }, []);

    useEffect(() => {
        if (validateRowData()) {
            let data = {
                test_date: rowData.test_date,
                name: rowData.name,
                value: rowData.value
            };
            axios.post(`${baseUrl}/blood_tests`, data, baseConfig).then(result => {
                console.log(result);
                let newTest = keyDictionary[keyDictionary.length];
                newTest.value = result.data.id;
                setIsNewRow(false);
            })
                .catch((error) => {
                    //handle error
                });;
        }
    }, [rowData]);



    const handleDelete = (keyValue) => {
        //delete row from list 
        let newTestsState;
        let deleteIndex = tests.findIndex(test => test.id === keyValue.value);
        if(deleteIndex === -1){
            keyDictionary.splice(keyDictionary.length,1);
            newTestsState = [...keyDictionary];
            setDictionary(newTestsState);
        }
        else{
            tests.splice(deleteIndex, 1);
            newTestsState = [...tests];
            setTests(newTestsState);
            keyDictionary.splice(deleteIndex,1);
            newTestsState = [...keyDictionary];
            setDictionary(newTestsState);
        }
        setIsNewRow(false);
        if (keyValue.value) {
            axios.delete(`${baseUrl}/blood_tests/${keyValue.value}`, baseConfig)
                .catch((error) => {
                    //handle error
                });
        }
    }

    const handleAdd = () => {
        //isFirstLogic
        setTests([...tests, rowData]);
        setDictionary([...keyDictionary,{key:`test-${count}`,value:''}]);
        setIsNewRow(true);
    }

    const handleChange = (value, key, id) => {
        if (id === 'TestId') {
            setRowData({ ...rowData, [key]: value });
        }
        else {
            if (value != '') {
                let updatedData = { [key]: value }
                axios.put(`${baseUrl}/blood_tests/${id}`, updatedData, baseConfig).then((result) => {
                    console.log(result);
                })
                    .catch((error) => {
                        //handle error
                    });
            }
        }
    }

    const createRow = (keyValue,test) => {
        return (
            <TableRow key={keyValue.key}>
                <TableCell align="left">
                    <SelectDrop
                        handleChange={handleChange}
                        initialTestName={test.name}
                        id={test.id} />
                </TableCell>
                <TableCell align="left">
                    <NumberInput
                        initValue={test.value}
                        id={test.id}
                        handleChange={handleChange}
                    />
                </TableCell>
                <TableCell align="left">
                    <DatePicker
                        testDate={test.test_date}
                        handleChange={handleChange}
                        id={test.id}
                        formatDate={formateDate}
                    />
                </TableCell>
                <TableCell align="left">
                    <IconButton onClick={() => handleDelete(keyValue)} color="secondary" aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
        );
    }

    const createHeader = () => {
        const headers = ['Name', 'Value', 'Date', ''];
        return (
            <TableRow>
                { headers.map((header, index) =>
                    <TableCell key={index} align="left">{header}</TableCell>
                )}
            </TableRow>
        )
    }


    return (
        isLoading ? <SpinnerLoader />
            :
            <TableContainer component={Paper} className={classes.tableContainer}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        {createHeader()}
                    </TableHead>
                    <TableBody>
                        {tests.map((test) => (
                            createRow(test)
                        ))}
                    </TableBody>
                </Table>
                <IconButton
                    onClick={() => handleAdd()}
                    color="primary"
                    disabled={isNewRow}
                    aria-label="add"
                    className={classes.addBtn}>
                    <AddCircleIcon fontSize="large" />
                </IconButton>
            </TableContainer>
    );
}

export default TestTable
