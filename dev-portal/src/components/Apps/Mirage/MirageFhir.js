import React, { PureComponent } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  CardContent,
  Grid,
  TextField,
  IconButton,
  Button,
  Snackbar,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormHelperText,
  Typography,
  Tooltip,
  Paper,
  Box,
  Fab
} from '@material-ui/core'
import {
  Assignment,
  Clear,
  FileCopy,
  Close as CloseIcon
} from '@material-ui/icons'
import fetch from 'cross-fetch'
import orange from '@material-ui/core/colors/orange'

import settings from '../../../settings'
import sampleR4 from '../../samples/SampleR4'
import sampleSTU3 from '../../samples/SampleSTU3'
import sampleDSTU2 from '../../samples/SampleDSTU2'
// import IncrementHistory from '../lib/IncrementHistory'

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(1),
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(2),
    justifyContent: 'center'
  },
  messageContainer: {
    margin: theme.spacing(2)
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
    marginRight: theme.spacing(1),
    color: 'white'
  },
  facadeOptions: {
    marginTop: 0,
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  },
  formControl: {
    margin: theme.spacing(1),
    width: 210
  },
  pediatricCheckbox: {
    margin: theme.spacing(1)
  },
  exportCountInputField: {
    margin: theme.spacing(1),
    minWidth: 90
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 210
  },
  raisedCard: {
    backgroundColor: 'white',
    color: '#000',
    '&:hover': {
      backgroundColor: orange[300],
      color: '#FFF'
    }
  },
  messageButtons: {
    marginLeft: 'auto'
  },
  coreButton: {
    margin: 3,
    marginTop: 0,
    color: '#FFF'
  }
})

class MirageFhir extends PureComponent {
  state = {
    fhirResourceType: 'patient',
    fhirVersion: 'R4',
    pediatricFlag: false,
    snackbarOpen: false,
    snackbarMessage: '',
    fakeMessage: JSON.parse(sampleR4),
    exportCount: 0,
    facilityName: 'General Hospital',
    processingId: 'P'
  }

  toggleSnackbar = (message) => {
    this.setState({
      snackbarOpen: !this.state.snackbarOpen,
      snackbarMessage: message
    })
  }

  copyMessage = (e) => {
    navigator.clipboard.writeText(this.state.fakeMessage)

    e.target.focus()
    this.toggleSnackbar('Message Copied to Clipboard')
  }

  pasteMessage = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Get pasted data via clipboard API
    navigator.clipboard
      .readText()
      .then((clipText) => this.setState({ fakeMessage: clipText }))

    e.target.focus()
  }

  generateMessage = async ({
    fhirVersion,
    fhirResourceType,
    facilityName,
    processingId,
    pediatricFlag
  }) => {
    try {
      const getMessageResponse = await fetch(
        `${settings.mirageUrl}/message/fhir`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': settings.anonApiKey
          },
          body: JSON.stringify({
            fhirVersion,
            resourceType: fhirResourceType,
            facilityName,
            processingId,
            pediatricFlag
          })
        }
      )

      const fakeMessage = await getMessageResponse.json()

      this.setState({
        fakeMessage: fakeMessage.messageJson || fakeMessage.messageString
      })
    } catch (err) {
      console.log('Error generating fake message ', err)
      this.setState({ snackbarOpen: true, snackbarMessage: err.message })
    }
  }

  handlePediatricCheck = (name) => (event) => {
    this.setState({ [name]: event.target.checked })
  }

  handleMessageVersionSelect = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      fakeMessage:
        event.target.value === 'STU3'
          ? JSON.parse(sampleSTU3)
          : JSON.parse(sampleDSTU2)
    })
  }

  handleResourceTypeSelect = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  render () {
    const { classes } = this.props
    const {
      fakeMessage,
      fhirResourceType,
      pediatricFlag,
      fhirVersion,
      snackbarOpen,
      snackbarMessage,
      facilityName,
      processingId
    } = this.state

    return (
      <div className={classes.root}>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          open={snackbarOpen}
          autoHideDuration={3600}
          onClose={this.toggleSnackbar}
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
              onClick={this.toggleSnackbar}
            >
              <CloseIcon />
            </IconButton>
          ]}
        />
        <Grid container direction='row'>
          <Grid item xs={3}>
            <div className={classes.facadeOptions}>
              <Typography variant='h6' className={classes.heading}>
                Static Values
              </Typography>
              <Paper>
                <form
                  className={classes.container}
                  noValidate
                  autoComplete='off'
                >
                  <FormControl
                    className={classes.formControl}
                    variant='outlined'
                  >
                    <InputLabel htmlFor='fhir-resource-type'>
                      FHIR Resource Type
                    </InputLabel>
                    <Select
                      value={fhirResourceType}
                      onChange={(e) => this.handleResourceTypeSelect(e)}
                      name='fhirResourceType'
                      id='fhir-resource-type'
                    >
                      <MenuItem value={'appointment'} disabled>
                        Appointment
                      </MenuItem>
                      <MenuItem value={'organization'} disabled>
                        Organization
                      </MenuItem>
                      <MenuItem value={'patient'} selected>
                        Patient
                      </MenuItem>
                      <MenuItem value={'practitioner'} disabled>
                        Practitioner
                      </MenuItem>
                      <MenuItem value={'more'} disabled>
                        <em>More coming soon</em>
                      </MenuItem>
                    </Select>
                    <FormHelperText>
                      The type of FHIR Resource that will be generated
                    </FormHelperText>
                  </FormControl>
                  <TextField
                    variant='outlined'
                    id='facility-name'
                    label='Facility Name'
                    aria-label='Facility Name'
                    className={classes.textField}
                    value={facilityName}
                    onChange={this.handleChange('facilityName')}
                    margin='normal'
                    fullWidth
                  />
                  <FormControl
                    className={classes.formControl}
                    variant='outlined'
                  >
                    <InputLabel htmlFor='message-version'>
                      FHIR Version
                    </InputLabel>
                    <Select
                      name='fhirVersion'
                      id='fhir-version'
                      value={fhirVersion}
                      onChange={(e) => this.handleMessageVersionSelect(e)}
                    >
                      <MenuItem value={'R4'}>R4</MenuItem>
                    </Select>
                    <FormHelperText>
                      Lastest release that can be generated is R4
                    </FormHelperText>
                  </FormControl>
                  <FormControlLabel
                    className={classes.pediatricCheckbox}
                    control={
                      <Checkbox
                        checked={pediatricFlag}
                        onChange={this.handlePediatricCheck('pediatricFlag')}
                        value={pediatricFlag.toString()}
                      />
                    }
                    label='Fake Patient should be under 18 years of age?'
                  />
                </form>
              </Paper>
            </div>
          </Grid>
          <Grid item xs={9}>
            <Card className={classes.messageContainer}>
              <CardContent>
                <Grid container spacing={1} direction='column'>
                  <Grid item xs={12}>
                    <Box display='flex'>
                      <Button
                        variant='contained'
                        color='primary'
                        className={classes.copyButton}
                        onClick={(e) =>
                          this.generateMessage({
                            fhirVersion,
                            facilityName,
                            fhirResourceType,
                            processingId,
                            pediatricFlag
                          })
                        }
                      >
                        Generate Fake Resource
                      </Button>
                      <div className={classes.messageButtons}></div>
                      <Tooltip title='Copy message' aria-label='Copy message'>
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Copy message'
                          onClick={(e) => this.copyMessage(e)}
                        >
                          <FileCopy />
                        </Fab>
                      </Tooltip>
                      <Tooltip title='Paste message' aria-label='Paste message'>
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Paste message'
                          onClick={(e) => this.pasteMessage(e)}
                        >
                          <Assignment />
                        </Fab>
                      </Tooltip>
                      <Tooltip title='Clear message' aria-label='clear message'>
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Clear message'
                          onClick={() => this.setState({ fakeMessage: '' })}
                        >
                          <Clear />
                        </Fab>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
                <TextField
                  id='messageBox'
                  label='FHIR Resource w Fake Data'
                  style={{ margin: 8 }}
                  value={
                    typeof fakeMessage === 'string'
                      ? fakeMessage
                      : JSON.stringify(fakeMessage, null, 2)
                  }
                  fullWidth
                  multiline
                  margin='normal'
                  variant='outlined'
                  InputLabelProps={{
                    shrink: true
                  }}
                  inputRef={(messageBox) => (this.messageBox = messageBox)}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { index: 1 })(MirageFhir)
