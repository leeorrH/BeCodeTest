import React, { useState, useEffect } from 'react';
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

// const results = [{
//     id: 1,
//     user_id: 0,
//     name: 'Glucose (B)',
//     test_date: '2012-02-21',
//     value: 95
// }];
const formateDate = () => {
    let currentDate = new Date();
    let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(currentDate);
    let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(currentDate);
    let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(currentDate);
    return (`${year}-${month}-${day}`);
}
const initialRowState = {
    id: 'TestId',
    name: '',
    test_date: formateDate(),
    value: 0
};

function TestTable() {
    const classes = useStyles();
    const [tests, setTests] = useState([]);
    const [rowData, setRowData] = useState(initialRowState);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewRow, setIsNewRow] = useState(false);

    useEffect(() => {
        axios.get(`${baseUrl}/blood_tests`, baseConfig).then(result => {
            console.log("comp render");
            if (result != null && Array.isArray(result.data)) {
                // result.data.push(results[0]);

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

    const validateRowData = () => {
        let isValid = false;
        if (rowData.value && rowData.test_date != '' && rowData.name != '') {
            isValid = true;
        }
        return isValid;
    }
    const handleDelete = (TestId) => {
        //delete row from list 
        let deleteIndex = tests.findIndex(test => test.id === TestId);
        tests.splice(deleteIndex, 1);
        let newTestsState = [...tests];
        setTests(newTestsState);
        setIsNewRow(false);
        if (TestId != 'TestId') {
            axios.delete(`${baseUrl}/blood_tests/${TestId}`, baseConfig)
                .catch((error) => {
                    //handle error
                });
        }
    }

    const handleAdd = () => {
        //isFirstLogic
        setTests([...tests, rowData]);
        setIsNewRow(true);
    }

    const handleChange = (e, key, id) => {
        if (id === 'TestId') {
            setRowData({ ...rowData, [key]: e.target.value });
            if (validateRowData()) {
                let data = {
                    test_date: rowData.test_date,
                    name: rowData.name,
                    value: key == 'value' ? parseInt(e.target.value) : rowData.value
                };
                axios.post(`${baseUrl}/blood_tests`, data, baseConfig).then(result => {
                    console.log(result);
                    let newData = tests.find(test => test.id === 'TestId');
                    newData.id = result.data.id;
                    //get the object from tests + update id 
                    //need to save temp id 
                    setIsNewRow(false);
                })
                    .catch((error) => {
                        //handle error
                    });;
            }
        }
        else {
            let updatedData = { [key]: e.target.value }
            axios.put(`${baseUrl}/blood_tests/${id}`, updatedData, baseConfig).then((result) => {
                console.log(result);
            })
                .catch((error) => {
                    //handle error
                });
        }
    }

    const createRow = (test) => {
        return (
            <TableRow key={test.id}>
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
                        testDate={test.test_date} />
                </TableCell>
                <TableCell align="left">
                    <IconButton onClick={() => handleDelete(test.id)} color="secondary" aria-label="delete">
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
                { headers.map(header =>
                    <TableCell align="left">{header}</TableCell>
                )}
            </TableRow>
        )
    }


    return (
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
