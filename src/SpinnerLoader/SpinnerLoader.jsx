import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign:'center',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function SpinnerLoader() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress/>
    </div>
  );
}