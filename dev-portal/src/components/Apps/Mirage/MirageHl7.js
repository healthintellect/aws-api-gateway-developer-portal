import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { withStyles } from '@material-ui/core/styles'
import {
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Snackbar,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Tooltip,
  Paper,
  Box,
  Fab,
  IconButton
} from '@material-ui/core'
import {
  Assignment,
  Clear,
  FileCopy,
  Close as CloseIcon
} from '@material-ui/icons'
import { orange } from '@material-ui/core/colors'
import fetch from 'cross-fetch'

import settings from '../../../settings'
import RaisedCard from './RaisedCard'
import sampleA28 from '../../samples/SampleMessageAdtA28'
// import IncrementHistory from '../lib/IncrementHistory'

const hl7MessageTypes = [
  {
    uuid: uuidv4(),
    messageType: 'ADT^A28',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'ADT^A31',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'ADT^A40',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'SIU^S12',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'SIU^S14',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'SIU^S15',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'MDM^T02',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'OMP^O09',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'ORU^R01',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'PPR^PC1',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  },
  {
    uuid: uuidv4(),
    messageType: 'VXU^V04',
    method: 'GET',
    url: 'https://mirage.hl7.cc/message/hl7'
  }
]

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing(1),
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
    marginRight: theme.spacing(1),
    color: 'white'
  },
  mirageOptions: {
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
  selectField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 210
  },
  raisedCard: {
    display: 'flex',
    justifyContent: 'center',
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

class MirageHl7 extends PureComponent {
  state = {
    messageVersion: '2.3',
    pediatricFlag: false,
    snackbarOpen: false,
    fakeMessage: sampleA28,
    exportCount: 0,
    sendingAppName: 'YourEHR',
    sendingFacilityName: 'YourHospital',
    receivingAppName: 'MyEHR',
    receivingFacilityName: 'MyClinic',
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

  restMessage = async (
    messageType,
    messageVersion,
    sendingAppName,
    sendingFacilityName,
    receivingAppName,
    receivingFacilityName,
    processingId,
    pediatricFlag
  ) => {
    try {
      const getMessageResponse = await fetch(
        `${settings.mirageUrl}/message/hl7`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': settings.anonApiKey
          },
          body: JSON.stringify({
            messageType,
            messageVersion,
            sendingAppName,
            sendingFacilityName,
            receivingAppName,
            receivingFacilityName,
            processingId,
            pediatricFlag
          })
        }
      )

      const newMessage = await getMessageResponse.json()
      this.setState({
        fakeMessage: newMessage.segments?.join('\n')
      })
    } catch (err) {
      console.error('Error calling HL7 message via REST: ', err)
      this.setState({ snackbarOpen: true, snackbarMessage: err.message })
    }
  }

  handlePediatricCheck = (name) => (event) => {
    this.setState({ [name]: event.target.checked })
  }

  handleMessageVersionSelect = (event) => {
    console.log('version change event: ', event)
    this.setState({ [event.target.name]: event.target.value })
  }

  handleChange = (name) => (event) => {
    this.setState({ [name]: event.target.value })
  }

  render () {
    const { classes } = this.props
    const {
      fakeMessage,
      pediatricFlag,
      messageVersion,
      snackbarOpen,
      snackbarMessage,
      sendingAppName,
      sendingFacilityName,
      receivingAppName,
      receivingFacilityName,
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
          message={
            <span id='message-id'>
              {typeof snackbarMessage === 'object'
                ? 'Try again in a moment'
                : snackbarMessage}
            </span>
          }
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
            <div className={classes.mirageOptions}>
              <Typography variant='h6' className={classes.heading}>
                Static Values
              </Typography>
              <Paper>
                <form
                  className={classes.container}
                  noValidate
                  autoComplete='off'
                >
                  <TextField
                    id='sending-app'
                    label='Sending Application Name'
                    aria-label='Sending Application Name'
                    className={classes.textField}
                    value={sendingAppName}
                    onChange={this.handleChange('sendingAppName')}
                    margin='normal'
                    helperText='MSH-3'
                    variant='outlined'
                  />
                  <TextField
                    id='sending-facility'
                    label='Sending Facility Name'
                    aria-label='Sending Facility Name'
                    className={classes.textField}
                    value={sendingFacilityName}
                    onChange={this.handleChange('sendingFacilityName')}
                    margin='normal'
                    helperText='MSH-4'
                    variant='outlined'
                  />
                  <TextField
                    id='receiving-app'
                    label='Receiving Application Name'
                    aria-label='Receiving Application Name'
                    className={classes.textField}
                    value={receivingAppName}
                    onChange={this.handleChange('receivingAppName')}
                    margin='normal'
                    helperText='MSH-5'
                    variant='outlined'
                  />
                  <TextField
                    id='receiving-facility'
                    label='Receiving Facility Name'
                    aria-label='Receiving Facility Name'
                    className={classes.textField}
                    value={receivingFacilityName}
                    onChange={this.handleChange('receivingFacilityName')}
                    margin='normal'
                    helperText='MSH-6'
                    variant='outlined'
                  />
                  <FormGroup row>
                    <TextField
                      id='processing-id'
                      label='Processing ID'
                      aria-label='Processing ID'
                      className={classes.selectField}
                      value={processingId}
                      onChange={this.handleChange('processingId')}
                      margin='normal'
                      helperText='MSH-11'
                      variant='outlined'
                      fullWidth
                    />
                    <FormControl
                      className={classes.formControl}
                      variant='outlined'
                    >
                      <InputLabel id='message-version-label'>
                        Message Version
                      </InputLabel>
                      <Select
                        labelId='message-version-label'
                        id='message-version'
                        name="messageVersion"
                        value={messageVersion}
                        onChange={this.handleMessageVersionSelect}
                      >
                        <MenuItem value={'2.1'}>2.1</MenuItem>
                        <MenuItem value={'2.2'}>2.2</MenuItem>
                        <MenuItem value={'2.3'}>2.3</MenuItem>
                        <MenuItem value={'2.3.1'}>2.3.1</MenuItem>
                        <MenuItem value={'2.4'}>2.4</MenuItem>
                        <MenuItem value={'2.5'}>2.5</MenuItem>
                        <MenuItem value={'2.6.1'}>2.6.1</MenuItem>
                        <MenuItem value={'2.7'}>2.7</MenuItem>
                        <MenuItem value={'2.7.1'}>2.7.1</MenuItem>
                      </Select>
                      <FormHelperText>MSH-12</FormHelperText>
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
                  </FormGroup>
                </form>
              </Paper>
            </div>
          </Grid>
          <Grid item xs={9}>
            <Typography variant='caption'>
              Click a message type to generate a message of that type with fake
              data...
            </Typography>
            <Grid container spacing={2}>
              {hl7MessageTypes &&
                hl7MessageTypes.map((endpoint) => (
                  <Grid item xs={12} md={2} key={endpoint.uuid}>
                    <RaisedCard
                      className={classes.raisedCard}
                      onClick={() =>
                        this.restMessage(
                          endpoint.messageType,
                          messageVersion,
                          sendingAppName,
                          sendingFacilityName,
                          receivingAppName,
                          receivingFacilityName,
                          processingId,
                          pediatricFlag
                        )
                      }
                    >
                      <CardContent>
                        <Typography
                          variant='subtitle1'
                          className={classes.method}
                          align='center'
                        >
                          <b>{endpoint.method}</b>
                        </Typography>
                        <Typography
                          variant='h5'
                          className={classes.messageType}
                        >
                          <b>{endpoint.messageType}</b>
                        </Typography>
                        <Typography variant='subtitle1' align='center'>
                          <b>MESSAGE</b>
                        </Typography>
                      </CardContent>
                    </RaisedCard>
                  </Grid>
                ))}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Grid container spacing={1} direction='column'>
                      <Grid item xs={12}>
                        <Box display='flex'>
                          <div className={classes.messageButtons}></div>
                          <Tooltip
                            title='Copy message'
                            aria-label='Copy message'
                          >
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
                          <Tooltip
                            title='Paste message'
                            aria-label='Paste message'
                          >
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
                          <Tooltip
                            title='Clear message'
                            aria-label='clear message'
                          >
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
                      label='HL7 Message w Fake Data'
                      style={{ margin: 8, whiteSpace: 'pre-line' }}
                      value={fakeMessage}
                      onChange={(e) =>
                        this.setState({ fakeMessage: e.currentTarget.value })
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
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(styles, { index: 1 })(MirageHl7)
