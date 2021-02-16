import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Fab,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tooltip
} from '@material-ui/core'
import { lightBlue } from '@material-ui/core/colors'
import { FileCopy, Clear, Assignment, ExpandMore } from '@material-ui/icons'
import Sticky from 'react-stickynode'
import HL7Dictionary from 'hl7-dictionary'
import { v4 as uuidv4 } from 'uuid'
import { Helmet } from 'react-helmet'

// mobx
import { observer } from 'mobx-react'

import sampleA28 from '../../samples/SampleMessageAdtA28'
import sampleOru from '../../samples/SampleMessageOruR01_1'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: theme.spacing(2),
    maxWidth: 450
  },
  textContent: {
    margin: theme.spacing(1)
  },
  coreButton: {
    margin: 3,
    marginTop: 0,
    color: 'white'
  },
  messageCard: {
    flex: 1,
    margin: theme.spacing(1)
  },
  messageInfoCard: {
    flex: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.secondary
  },
  tableRow: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: `${lightBlue[300]} !important`,
      '& > .MuiTableCell-root': {
        color: 'yellow'
      }
    },
    '&:hover': {
      backgroundColor: `${lightBlue[300]} !important`
    }
  },
  messageButtons: {
    marginLeft: 'auto'
  }
}), { index: 1 })

const Farser = observer(() => {
  const location = useLocation()
  const classes = useStyles()
  const [message, setMessage] = useState('')
  const [messageInfo, setMessageInfo] = useState({})
  const [messageDefinition, setMessageDefinition] = useState({})
  const [segments, setSegments] = useState([])
  const [segmentList, setSegmentList] = useState([])
  const [selectedSegment, setSelectedSegment] = useState(null)
  const [selectedSegmentAbbr, setSelectedSegmentAbbr] = useState('')
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState('')
  const [fieldList, setFieldList] = useState([])
  const [components, setComponents] = useState([])
  const [selectedComponent, setSelectedComponent] = useState('')
  const [componentList, setComponentList] = useState([])
  const [subcomponentList, setSubcomponentList] = useState([])
  const [fieldRepetitionList, setFieldRepetitionList] = useState([])

  const clearMessage = () => {
    setMessage('')
    setMessageInfo({})
    setMessageDefinition({})
    setSegments([])
    setSegmentList([])
    setSelectedSegment('')
    setFields([])
    setFieldList([])
    setComponents([])
    setComponentList([])
    setSubcomponentList([])
    setFieldRepetitionList([])
  }

  const loadSampleMessage = () => {
    clearMessage()
    processMessage({
      target: {
        value: sampleOru
      }
    })
  }

  const processMessage = (e) => {
    setMessage(e.target.value)
    setMessageInfo({
      messageType: e.target.value?.split(/\r?\n/g)[0]?.split('|')[8],
      messageVersion: e.target.value?.split(/\r?\n/g)[0]?.split('|')[11]
    })
    setMessageDefinition(
      HL7Dictionary.definitions[
        e.target.value?.split(/\r?\n/g)[0]?.split('|')[11]
      ]
    )
    parseSegments(e.target.value)
  }

  const parseSegments = (messageToParse) => {
    const segmentList = messageToParse?.split(/\r?\n/g).map((segment, i) => ({
      uuid: uuidv4(),
      segmentIndex: i,
      segmentNumber: i + 1,
      segmentAbbr: segment.split('|')[0]
    }))

    const segments = messageToParse?.split(/\r?\n/g)

    setSegments(segments)
    setSegmentList(segmentList)
  }

  const parseSelectedSegment = (selectedSegmentNumber, newSelectedSegment) => {
    setFields([])
    setFieldList([])
    setComponents([])
    setComponentList([])
    setSubcomponentList([])
    setFieldRepetitionList([])
    setSelectedComponent('')
    setSelectedField('')
    setSelectedSegment('')
    setSelectedSegmentAbbr('')

    const fieldList = segments[selectedSegmentNumber - 1]
      .split('|')
      .map((field, i) => {
        if (newSelectedSegment === 'MSH') {
          return {
            uuid: uuidv4(),
            fieldIndex: i - 1,
            fieldNumber: i + 1,
            fieldDescription:
              messageDefinition?.segments[newSelectedSegment]?.fields[i]?.desc,
            fieldValue: field
          }
        } else {
          return {
            uuid: uuidv4(),
            fieldIndex: i - 1,
            fieldNumber: i,
            fieldDescription:
              messageDefinition?.segments[newSelectedSegment]?.fields[i - 1]
                ?.desc,
            fieldValue: field
          }
        }
      })

    fieldList.shift()

    if (newSelectedSegment === 'MSH') {
      fieldList.unshift({
        uuid: uuidv4(),
        fieldIndex: 1,
        fieldNumber: 1,
        fieldDescription:
          messageDefinition?.segments[newSelectedSegment]?.fields[0]?.desc,
        fieldValue: '|'
      })
    }

    const fields = segments[selectedSegmentNumber - 1].split('|')

    fields.shift()

    setSelectedSegmentAbbr(newSelectedSegment)
    setSelectedSegment(selectedSegmentNumber)
    setFieldList(fieldList)
    setFields(fields)
  }

  const parseSelectedField = (selectedFieldIndex) => {
    setSelectedField(selectedFieldIndex)
    const componentList = fields[selectedFieldIndex]
      .split('^')
      .map((component, i) => ({
        uuid: uuidv4(),
        componentIndex: i,
        componentNumber: i + 1,
        componentDescription:
          messageDefinition?.fields[
            messageDefinition?.segments[selectedSegmentAbbr]?.fields[
              selectedFieldIndex
            ]?.datatype
          ]?.subfields[i]?.desc ||
          messageDefinition?.fields[
            messageDefinition?.segments[selectedSegmentAbbr]?.fields[
              selectedFieldIndex
            ]?.datatype
          ]?.desc,
        componentValue: component
      }))

    const components = fields[selectedFieldIndex].split('^')

    const fieldRepetitionList = fields[selectedFieldIndex]
      .split('~')
      .map((fieldRepetition, i) => ({
        uuid: uuidv4(),
        fieldNumber: selectedFieldIndex + 1,
        fieldRepetitionIndex: i,
        fieldRepetitionNumber: i + 1,
        fieldRepetitionValue: fieldRepetition
      }))

    setComponentList(componentList)
    setComponents(components)
    setFieldRepetitionList(fieldRepetitionList)
  }

  const parseSelectedComponent = (selectedComponentIndex) => {
    setSelectedComponent(selectedComponentIndex)
    const subcomponentList = components[selectedComponentIndex]
      .split('&')
      .map((subcomponent, i) => ({
        uuid: uuidv4(),
        subcomponentIndex: i,
        subcomponentNumber: i + 1,
        subcomponentDescription: '',
        subcomponentValue: subcomponent
      }))

    setSubcomponentList(subcomponentList)
  }

  const copyMessage = (e) => {
    navigator.clipboard.writeText(message)

    e.target.focus()
  }

  const pasteMessage = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Get pasted data via clipboard API
    navigator.clipboard.readText().then((clipText) => setMessage(clipText))

    e.target.focus()
  }

  useEffect(() => {
    const premessage = new URLSearchParams(location.search).get('premessage')

    if (premessage) {
      processMessage({
        target: {
          value: premessage
        }
      })
    }
  })

  return (
    <div className={classes.root}>
      <Helmet>
        <meta
          name='description'
          content='Farser is a web based HL7 message viewer that displays fields, components, sub-components, and repeating fields in an easy to read format. '
        />
        <title>Farser - Parse/Read HL7 Messages</title>
        <link rel='canonical' href='https://hl7.cc/farser' />
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Accordion defaultExpanded>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls='messageToParse'
              id='message-parse'
            >
              <Typography variant='h6'>Message to Parse</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} direction='column'>
                <Grid item xs={12}>
                  <Box display='flex'>
                    <Button
                      variant='contained'
                      color='primary'
                      className={classes.coreButton}
                      onClick={loadSampleMessage}
                    >
                      Sample Message
                    </Button>
                    <div className={classes.messageButtons}></div>
                    <Tooltip title='Copy message' aria-label='Copy message'>
                      <Fab
                        color='primary'
                        size='small'
                        className={classes.coreButton}
                        aria-label='Copy message'
                        onClick={copyMessage}
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
                        onClick={pasteMessage}
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
                        onClick={clearMessage}
                      >
                        <Clear />
                      </Fab>
                    </Tooltip>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <TextField
                      id='messageBox'
                      label='Paste your HL7 Message Here'
                      style={{ margin: 8 }}
                      placeholder={sampleA28.split('\n')[0]}
                      fullWidth
                      multiline
                      margin='normal'
                      variant='outlined'
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={message}
                      onChange={processMessage}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant='h6'>Message Information</Typography>
            <Typography variant='body1'>
              Message Type: {messageInfo && messageInfo.messageType}
            </Typography>
            <Typography variant='body1'>
              Message Version: {messageInfo && messageInfo.messageVersion}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={2}>
          <Paper className={classes.paper}>
            <Typography variant='h6'>Segments</Typography>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Segment Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {segmentList &&
                  segmentList.map((row) => {
                    return (
                      <TableRow
                        key={row.uuid}
                        onClick={() =>
                          parseSelectedSegment(
                            row.segmentNumber,
                            row.segmentAbbr
                          )
                        }
                        selected={selectedSegment === row.segmentNumber}
                        classes={{ selected: classes.selected }}
                        className={classes.tableRow}
                      >
                        <TableCell component='th' scope='row'>
                          {row.segmentAbbr}
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={10}>
          <Sticky enabled={true} top={18}>
            <Grid container spacing={1} direction='row'>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Typography variant='h6'>
                    {selectedSegmentAbbr} Fields
                  </Typography>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field #</TableCell>
                        <TableCell>Field Description</TableCell>
                        <TableCell>Field</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fieldList &&
                        fieldList.map((row) => {
                          return (
                            <TableRow
                              key={row.uuid}
                              onClick={() => parseSelectedField(row.fieldIndex)}
                              className={classes.tableRow}
                              selected={selectedField === row.fieldIndex}
                            >
                              <TableCell component='th' scope='row'>
                                {row.fieldNumber}
                              </TableCell>
                              <TableCell align='left'>
                                {row.fieldDescription}
                              </TableCell>
                              <TableCell align='left'>
                                {row.fieldValue}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Typography variant='h6'>Components</Typography>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Component Description</TableCell>
                            <TableCell>Component</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {componentList &&
                            componentList.map((row) => {
                              return (
                                <TableRow
                                  key={row.uuid}
                                  onClick={() =>
                                    parseSelectedComponent(row.componentIndex)
                                  }
                                  className={classes.tableRow}
                                  selected={
                                    selectedComponent === row.componentIndex
                                  }
                                >
                                  <TableCell component='th' scope='row'>
                                    {row.componentNumber}
                                  </TableCell>
                                  <TableCell align='left'>
                                    {row.componentDescription}
                                  </TableCell>
                                  <TableCell align='left'>
                                    {row.componentValue}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Typography variant='h6'>Sub-Components</Typography>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Sub-Component Description</TableCell>
                            <TableCell>Sub-Component</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {subcomponentList &&
                            subcomponentList.map((row) => {
                              return (
                                <TableRow
                                  key={row.uuid}
                                  className={classes.tableRow}
                                  selected={
                                    selectedField === row.subcomponentIndex
                                  }
                                >
                                  <TableCell component='th' scope='row'>
                                    {row.subcomponentNumber}
                                  </TableCell>
                                  <TableCell align='left'>
                                    {row.subcomponentDescription}
                                  </TableCell>
                                  <TableCell align='left'>
                                    {row.subcomponentValue}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <Typography variant='h6'>Field Repetition</Typography>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Field #</TableCell>
                            <TableCell>Repetition #</TableCell>
                            <TableCell>Repetition Contents</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fieldRepetitionList &&
                            fieldRepetitionList.map((row) => {
                              return (
                                <TableRow
                                  key={row.uuid}
                                  className={classes.tableRow}
                                  selected={selectedField === row.fieldNumber}
                                >
                                  <TableCell component='th' scope='row'>
                                    {row.fieldNumber}
                                  </TableCell>
                                  <TableCell align='left'>
                                    {row.fieldRepetitionNumber}
                                  </TableCell>
                                  <TableCell align='left'>
                                    {row.fieldRepetitionValue}
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                        </TableBody>
                      </Table>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Sticky>
        </Grid>
      </Grid>
    </div>
  )
})

export default Farser
