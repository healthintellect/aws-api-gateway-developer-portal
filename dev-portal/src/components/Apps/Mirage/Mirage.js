import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Snackbar,
  Typography,
  Fade,
  Switch
} from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import { orange } from '@material-ui/core/colors'
import MirageHl7 from './MirageHl7'
import MirageFhir from './MirageFhir'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
    maxWidth: 360,
    justifyContent: 'center'
  },
  messageType: {
    color: 'inherit'
  },
  url: {
    color: 'inherit'
  },
  method: {
    color: '#4BB543'
  },
  copyButton: {
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  mirageOptions: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 180
  },
  pediatricCheckbox: {
    marginRight: theme.spacing(1)
  },
  exportCountInputField: {
    margin: theme.spacing(1),
    minWidth: 90
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200
  },
  raisedCard: {
    backgroundColor: 'white',
    color: '#000',
    '&:hover': {
      backgroundColor: orange[300],
      color: '#FFF'
    }
  },
  messageSwitch: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw'
  }
}), { index: 1 })

const Mirage = () => {
  const classes = useStyles()
  const [checked, setChecked] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const toggleSnackbar = (message) => {
    setSnackbarOpen(!snackbarOpen)
    setSnackbarMessage(message)
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <title>
          Mirage - Generate HL7 and FHIR messages with fake patient data
        </title>
        <meta
          name='description'
          content='The Mirage tool is used to generate HL7 and FHIR data that contain fake data in commonly used fields.'
        />
        <link rel='canonical' href='https://hl7.cc/mirage' />
      </Helmet>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={snackbarOpen}
        autoHideDuration={3600}
        onClose={toggleSnackbar}
        ContentProps={{
          'aria-describedby': 'message-id'
        }}
        message={<span id='message-id'>{snackbarMessage}</span>}
        action={[
          <IconButton
            key='close'
            aria-label='Close'
            color='inherit'
            className={classes.close}
            onClick={toggleSnackbar}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
      <Typography variant='caption'>
        Toggle between HL7 and FHIR to generate a message of that type...
      </Typography>
      <div className={classes.messageSwitch}>
        <label>
          <Typography>HL7</Typography>
        </label>
        <Switch
          label='FHIR'
          checked={checked}
          onChange={() => setChecked(!checked)}
          aria-label='Toggle Create a HL7 or FHIR message'
          color='secondary'
        />
        <label>
          <Typography>FHIR</Typography>
        </label>
      </div>
      <div className={classes.container}>
        {checked ? (
          <Fade in={checked} timeout={{ enter: 5000, exit: 5000 }}>
            <MirageFhir />
          </Fade>
        ) : (
          <Fade in={checked} timeout={{ enter: 5000, exit: 5000 }}>
            <MirageHl7 />
          </Fade>
        )}
      </div>
    </div>
  )
}

export default Mirage
