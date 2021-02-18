import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles'
import { useLocation } from 'react-router-dom'
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Fab,
  Box,
  Snackbar,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions
} from '@material-ui/core'
import {
  Close as CloseIcon,
  Assignment,
  Clear,
  FileCopy,
  ExpandMore,
  Sync,
  SyncDisabled,
  SyncProblem
} from '@material-ui/icons'
import fetch from 'cross-fetch'
import Iframe from 'react-iframe'

// mobx
import { observer } from 'mobx-react'

import settings from '../../../settings'
import { getCognitoUrl } from '../../../services/self'
import TextEditor from '../../TextEditor'
import Sidebar from './Sidebar'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column'
  },
  coreButton: {
    margin: 3,
    marginTop: 0,
    color: '#FFF'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  messageButtons: {
    marginLeft: 'auto'
  },
  heading: {
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  fabButton: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: 0
  },
  recycleFab: {
    color: '#FFF',
    margin: 0,
    top: 'auto',
    right: -30,
    bottom: 360,
    left: 'auto',
    position: 'float',
    zIndex: 9
  },
  dialogBody: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary
  }
}), { index: 1 })

const Rosetta = observer(() => {
  const classes = useStyles()
  const location = useLocation()
  const [convertMessage, setConvertMessage] = useState('')
  const [fhirTemplate, setFhirTemplate] = useState('')
  const [fhirMessage, setFhirMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [showApiDocs, setShowApiDocs] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const [convertError, setConvertError] = useState(false)
  const [convertDisabled, setConvertDisabled] = useState(true)
  const [showHelp, setShowHelp] = useState(false)

  const toggleSnackbar = (message) => {
    setSnackbarOpen(!snackbarOpen)
    setSnackbarMessage(message)
  }

  const copyConvertMessage = (e) => {
    navigator.clipboard.writeText(convertMessage)

    e.target.focus()
    toggleSnackbar('HL7 Message Copied to Clipboard')
  }

  const copyFhirTemplate = (e) => {
    navigator.clipboard.writeText(JSON.stringify(fhirTemplate, null, 2))

    e.target.focus()
    toggleSnackbar('FHIR Message Copied to Clipboard')
  }

  const copyFhirMessage = (e) => {
    navigator.clipboard.writeText(JSON.stringify(fhirMessage, null, 2))

    e.target.focus()
    toggleSnackbar('FHIR Message Copied to Clipboard')
  }

  const pasteConvertMessage = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Get pasted data via clipboard API
    navigator.clipboard
      .readText()
      .then((clipText) => setConvertMessage(clipText))

    e.target.focus()
  }

  const pasteFhirTemplate = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Get pasted data via clipboard API
    navigator.clipboard.readText().then((clipText) => setFhirTemplate(clipText))

    e.target.focus()
  }

  const updateConvertStatus = () => {
    if (!convertMessage || !fhirTemplate) {
      setConvertDisabled(true)
    } else {
      setConvertDisabled(false)
    }
  }

  const processConvertMessage = (e) => {
    e.stopPropagation()
    e.preventDefault()

    setConvertMessage(e.target.value)
    updateConvertStatus()
    fhirTemplate && convertToFhir()
  }

  const processFhirMessage = (e) => {
    e.stopPropagation()
    e.preventDefault()

    setFhirMessage(e.target.value)
  }

  const processFhirTemplate = (value) => {
    setFhirTemplate(value)
    updateConvertStatus()
    convertMessage && convertToFhir()
  }

  const convertToFhir = async () => {
    setIsConverting(true)
    const sampleType =
      convertMessage.substring(0, 3) === 'MSH' ? 'hl7v2' : 'cda'

    if (!!convertMessage && !!fhirTemplate) {
      // Template and message exist so perform conversion
      try {
        const convertResponse = await fetch(
          `${settings.rosettaUrl}/api/convert/${sampleType}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: '*/*',
              'X-API-Key': settings.anonApiKey
            },
            body: JSON.stringify({
              templateBase64: btoa(fhirTemplate),
              srcDataBase64: btoa(convertMessage)
            })
          }
        )

        const convertedMessage = await convertResponse.json()

        setFhirMessage(convertedMessage)
        setIsConverting(false)
        setConvertError(false)
      } catch (err) {
        setIsConverting(false)
        setConvertError(true)
        toggleSnackbar('Failed to convert message to FHIR. ', err.message)
        console.error('Failed to convert message to FHIR: ', err)
      }
    } else {
      setIsConverting(false)
      setConvertError(true)
    }
  }

  useEffect(() => {
    const premessage = new URLSearchParams(location.search).get('premessage')

    if (premessage) {
      const isHl7 = premessage.substring(0, 3) === 'MSH'
      const isFhir = !!JSON.parse(premessage).resourceType

      if (isHl7) {
        processConvertMessage({
          target: {
            value: premessage
          }
        })
      } else if (isFhir) {
        processFhirMessage({
          target: {
            value: premessage
          }
        })
      }
    }

    updateConvertStatus()
  })

  const toggleHelpDialog = () => {
    setShowHelp(!showHelp)
  }

  return (
    <div className={classes.root}>
      <Helmet>
        <meta
          name='description'
          content='Rosetta uses the Microsoft FHIR converter API to convert a HL7 message or a CDA into a single FHIR resource or a bundle of FHIR resources based on a template of your choosing.'
        />
        <title>Rosetta - Convert HL7 and CDA messages to FHIR resources</title>
        <link rel='canonical' href='https://hl7.cc/rosetta' />
      </Helmet>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={snackbarOpen}
        autoHideDuration={3600}
        onClose={() => toggleSnackbar()}
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
            onClick={() => toggleSnackbar()}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
      <Dialog onClose={toggleHelpDialog} aria-labelledby="help-dialog-title" open={showHelp}>
        <DialogTitle id="help-dialog-title">How to Use Rosetta</DialogTitle>
        <div className={classes.dialogBody}>
          <ol>
            <li>Provide a source messages that will be used to populate the patient data in the FHIR resource</li>
            <ul>
              <li>Option 1: Paste your HL7 or CDA message into the Message to Convert box</li>
              <li>Option 2: Choose a sample HL7 or CDA from the sidebar menu</li>
            </ul>
            <li>Choose a HL7 or CDA handlebars template from the Message Templates sidebar menu</li>
            <ul>
              <li>Option 1: Choose a sample HL7 or CDA from the sidebar menu</li>
              <li>Option 2: Create your own handlebars template in the FHIR Template box</li>
            </ul>
            <li>Click the convert button <Sync /></li>
            <li>Your
              HL7v2 or CCDA message will then be converted and displayed in the
              Converted FHIR Message editor.</li>
          </ol>
          <DialogActions>
            <Typography variant="caption"><a href={getCognitoUrl('login')}>Signup for a developer account</a> for access to receive an API key and get access to Swagger API documentation.</Typography></DialogActions>
        </div>
      </Dialog>
      <Grid container spacing={1} direction='row'>
        <Grid item xs={2}>
          <Sidebar
            setFhirTemplate={setFhirTemplate}
            setConvertMessage={setConvertMessage}
            fhirTemplate={fhirTemplate}
            convertMessage={convertMessage}
            setFhirMessage={setFhirMessage}
            setShowApiDocs={setShowApiDocs}
            showApiDocs={showApiDocs}
            updateConvertStatus={updateConvertStatus}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
            toggleHelpDialog={toggleHelpDialog}
          />
        </Grid>
        <Grid item xs={10} height='207%'>
          {showApiDocs ? (
            <Grid container direction='row' spacing={1}>
              <Grid item xs={12}>
                <Iframe
                  url='https://rosetta.hl7.cc/api-docs'
                  id='rosetta-docs'
                  display='initial'
                  position='relative'
                  width='100%'
                  height='999px'
                />
              </Grid>
            </Grid>
          ) : (
            <>
              <Grid container direction='row' spacing={1}>
                <Grid item xs={12}>
                  <Accordion defaultExpanded>
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls='messageToConvert'
                      id='message-convert'
                    >
                      <Typography variant='h6' className={classes.heading}>
                        Message to Convert
                      </Typography>
                      <Typography
                        variant='overline'
                        className={classes.secondaryHeading}
                      >
                        HL7 or CDA format
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
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
                                onClick={copyConvertMessage}
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
                                onClick={pasteConvertMessage}
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
                                onClick={() => setConvertMessage('')}
                              >
                                <Clear />
                              </Fab>
                            </Tooltip>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            id='convertMessageBox'
                            label='Message to Convert'
                            style={{ margin: 8 }}
                            placeholder='Paste or enter the source message in CDA or HL7v2 format here. This data will be used to populate data in the converted FHIR message.'
                            fullWidth
                            multiline
                            margin='normal'
                            variant='outlined'
                            InputLabelProps={{
                              shrink: true
                            }}
                            value={convertMessage}
                            onChange={processConvertMessage}
                          />
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.paper}>
                    <Box display='flex'>
                      <Typography variant='h6'>FHIR Template</Typography>
                      <div className={classes.messageButtons}></div>
                      <Tooltip title='Copy Template' aria-label='Copy template'>
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Copy template'
                          onClick={copyFhirTemplate}
                        >
                          <FileCopy />
                        </Fab>
                      </Tooltip>
                      <Tooltip
                        title='Paste Template'
                        aria-label='Paste template'
                      >
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Paste template'
                          onClick={pasteFhirTemplate}
                        >
                          <Assignment />
                        </Fab>
                      </Tooltip>
                      <Tooltip
                        title='Clear Template'
                        aria-label='clear template'
                      >
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Clear template'
                          onClick={() => setFhirTemplate('')}
                        >
                          <Clear />
                        </Fab>
                      </Tooltip>
                    </Box>
                    <TextEditor
                      mode='handlebars'
                      theme='xcode'
                      name='FHIR Template'
                      width='100%'
                      showGutter={true}
                      highlightActiveLine={true}
                      value={fhirTemplate}
                      fontSize={12}
                      onChange={processFhirTemplate}
                    />
                    <Typography variant='subtitle2'>
                      Templates are created using the{' '}
                      <a href='https://handlebarsjs.com/guide/#what-is-handlebars' rel='noopener noreferrer' target="_blank">
                        Handlebars
                      </a>{' '}
                      templating language.
                    </Typography>
                  </Paper>
                  <div className={classes.fabButton}>
                    <Tooltip
                      title={'Convert Message to FHIR'}
                      aria-label={'Convert Message to FHIR'}
                      placement='top'
                    >
                      <span>
                        <Fab
                          color='primary'
                          className={classes.recycleFab}
                          onClick={() => convertToFhir()}
                          disabled={convertDisabled}
                        >
                          {isConverting ? (
                            <CircularProgress color='secondary' margin={3} />
                          ) : convertError ? (
                            <SyncProblem />
                          ) : convertDisabled ? (
                            <SyncDisabled />
                          ) : (
                            <Sync />
                          )}
                        </Fab>
                      </span>
                    </Tooltip>
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.paper}>
                    <Box display='flex' justifyContent='flex-end'>
                      <Typography variant='h6'>
                        Converted FHIR Message
                      </Typography>
                      <div className={classes.messageButtons}></div>
                      <Tooltip title='Copy Message' aria-label='Copy message'>
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Copy message'
                          onClick={copyFhirMessage}
                        >
                          <FileCopy />
                        </Fab>
                      </Tooltip>
                      <Tooltip title='Clear Message' aria-label='clear message'>
                        <Fab
                          color='primary'
                          size='small'
                          className={classes.coreButton}
                          aria-label='Clear message'
                          onClick={() => setFhirMessage('')}
                        >
                          <Clear />
                        </Fab>
                      </Tooltip>
                    </Box>
                    <TextEditor
                      mode='javascript'
                      theme='xcode'
                      width='100%'
                      name='FHIR Message'
                      showGutter={true}
                      highlightActiveLine={true}
                      value={
                        fhirMessage !== ''
                          ? JSON.stringify(fhirMessage, null, 2)
                          : fhirMessage
                      }
                      fontSize={12}
                      onChange={processFhirMessage}
                    />

                    <Typography variant='subtitle2'>
                      Learn more about the{' '}
                      <a href='http://www.fhir.org/' rel='noopener noreferrer' target="_blank">HL7 FHIR</a> standard.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </div>
  )
})

export default Rosetta
