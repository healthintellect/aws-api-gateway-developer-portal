import React, { PureComponent } from 'react'
import { Helmet } from 'react-helmet'
import { withStyles } from '@material-ui/core/styles'
import {
  Button,
  Typography,
  Grid,
  Paper,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Box,
  Fab,
  Tooltip,
  TableBody
} from '@material-ui/core'
import { FileCopy, Assignment, Clear } from '@material-ui/icons'
import HL7Dictionary from 'hl7-dictionary'
import { v4 as uuidv4 } from 'uuid'
import { lightBlue } from '@material-ui/core/colors'
import fetch from 'cross-fetch'

// mobx
import { observer } from 'mobx-react'

import settings from '../../../settings'
import sampleA28 from '../../samples/SampleMessageAdtA28'
// import IncrementHistory from '../lib/IncrementHistory';

const styles = (theme) => ({
  root: {
    margin: theme.spacing(2),
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
  button: {
    margin: 3,
    marginTop: 0,
    color: 'white'
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
  selected: {
    backgroundColor: `${lightBlue[300]} !important`,
    fontWeight: 'bold',
    color: 'white'
  },
  messageButtons: {
    marginLeft: 'auto'
  }
})

class Juxtapose extends PureComponent {
  state = {
    message1: {
      message: '',
      messageInfo: {},
      messageDefinition: {},
      segments: [],
      segmentList: [],
      fields: [],
      fieldList: [],
      components: [],
      componentList: [],
      subcomponents: [],
      subcomponentList: [],
      fieldRepetition: [],
      fieldRepetitionList: []
    },
    message2: {
      message: '',
      messageInfo: {},
      messageDefinition: {},
      segments: [],
      segmentList: [],
      fields: [],
      fieldList: [],
      components: [],
      componentList: [],
      subcomponents: [],
      subcomponentList: [],
      fieldRepetition: [],
      fieldRepetitionList: []
    },
    selectedRows: [],
    differences: []
  }

  componentDidMount () {
    if (this.props.router?.query?.premessage) {
      this.processMessage({
        currentTarget: {
          id: 'message1'
        },
        target: {
          value: this.props.router?.query?.premessage
        }
      })
    }
  }

  copyMessage1 = (e) => {
    navigator.clipboard.writeText(this.state.message1.message)

    e.target.focus()
  }

  pasteMessage1 = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Get pasted data via clipboard API
    navigator.clipboard.readText().then((clipText) =>
      this.setState((prevState) => ({
        message1: {
          ...prevState.message1,
          message: clipText
        }
      }))
    )

    e.target.focus()
  }

  clearMessage1 = (e) => {
    this.setState({
      message1: {
        message: '',
        messageInfo: {},
        messageDefinition: {},
        segments: [],
        segmentList: [],
        fields: [],
        fieldList: [],
        components: [],
        componentList: [],
        subcomponents: [],
        subcomponentList: [],
        fieldRepetition: [],
        fieldRepetitionList: []
      }
    })

    e.target.focus()
  }

  copyMessage2 = (e) => {
    navigator.clipboard.writeText(this.state.message2.message)

    e.target.focus()
  }

  pasteMessage2 = (e) => {
    e.stopPropagation()
    e.preventDefault()

    // Get pasted data via clipboard API
    navigator.clipboard.readText().then((clipText) =>
      this.setState((prevState) => ({
        message2: {
          ...prevState.message2,
          message: clipText
        }
      }))
    )

    e.target.focus()
  }

  clearMessage2 = (e) => {
    this.setState({
      message2: {
        message: '',
        messageInfo: {},
        messageDefinition: {},
        segments: [],
        segmentList: [],
        fields: [],
        fieldList: [],
        components: [],
        componentList: [],
        subcomponents: [],
        subcomponentList: [],
        fieldRepetition: [],
        fieldRepetitionList: []
      }
    })

    e.target.focus()
  }

  componentDidUpdate (prevProps, prevState) {
    const { message1, message2 } = this.state
    const oldMessage1 = prevState.message1
    const oldMessage2 = prevState.message2

    if (
      message1?.segments?.length > 0 &&
      message2?.segments?.length > 0 &&
      (message1 !== oldMessage1 || message2 !== oldMessage2)
    ) {
      const compareMessages =
        message1?.segments?.length > 0 &&
        message2?.segments?.length > 0 &&
        message1.segments[0].split('|')[0] &&
        message2.segments[0].split('|')[0]

      const message1Segments = message1?.segments

      const message2Segments = message2?.segments

      if (compareMessages) {
        if (
          message1Segments &&
          message2Segments &&
          message1Segments.length > message2Segments.length
        ) {
          for (let j = 0; j < message1Segments.length; j++) {
            if (
              message1Segments[j]?.split('|')[0] !==
              message2Segments[j]?.split('|')[0]
            ) {
              message2Segments.splice(j, 0, message1Segments[j].split('|')[0])
            }
          }
        } else if (
          message1Segments &&
          message2Segments &&
          message1Segments.length < message2Segments.length
        ) {
          for (let j = 0; j < message2Segments.length; j++) {
            if (
              message1Segments[j]?.split('|')[0] !==
              message2Segments[j]?.split('|')[0]
            ) {
              message1Segments.splice(j, 0, message2Segments[j].split('|')[0])
            }
          }
        }

        const message1Differences =
          message1Segments &&
          message2Segments &&
          [].concat(
            ...message1Segments.map((segment1, i) =>
              segment1
                .split('|')
                .map((field1, k) => {
                  if (!message2Segments[i]?.split('|')[k]?.includes(field1)) {
                    const notInMessage2 = !message2.segmentList.filter(
                      (seg) => seg.segmentAbbr === segment1.split('|')[0]
                    )[0]
                    const notInMessage1 = !message1.segmentList.filter(
                      (seg) => seg.segmentAbbr === segment1.split('|')[0]
                    )[0]
                    return {
                      rowIndex: this.state.message1.segmentList.filter(
                        (seg) => seg.segmentAbbr === segment1.split('|')[0]
                      )[0].segmentIndex,
                      field:
                        segment1.split('|')[0] +
                        (segment1.split('|')[1] &&
                        segment1.split('|')[0] !== 'MSH' &&
                        segment1.split('|')[0] !== 'EVN'
                          ? '[' + segment1.split('|')[1] + ']'
                          : '') +
                        '-' +
                        (segment1.split('|')[0] === 'MSH' ? k + 1 : k),
                      fieldDescription: this.state.message1.messageDefinition
                        ?.segments[segment1.split('|')[0]]?.fields[
                          segment1.split('|')[0] === 'MSH' ? k : k - 1
                        ]?.desc,
                      field1Value:
                        !field1 && field1 !== '' && notInMessage1
                          ? segment1.split('|')[0] +
                            ' Segment Missing from Message1'
                          : !field1 && notInMessage2 && field1 !== ''
                            ? segment1.split('|')[0] +
                            ' Segment Missing from Message 2'
                            : field1,
                      field2Value:
                        !message2Segments[i]?.split('|')[k] &&
                        message2Segments[i]?.split('|')[k] !== '' &&
                        notInMessage1
                          ? segment1.split('|')[0] +
                            ' Segment Missing from Message1'
                          : !message2Segments[i]?.split('|')[k] &&
                            message2Segments[i]?.split('|')[k] !== '' &&
                            notInMessage2
                            ? segment1.split('|')[0] +
                            ' Segment Missing from Message 2'
                            : message2Segments[i]?.split('|')[k]
                    }
                  } else {
                    return null
                  }
                })
                .filter((el) => !!el)
            )
          )

        const message2Differences =
          message1Segments &&
          message2Segments &&
          [].concat(
            ...message2Segments.map((segment, i) =>
              segment
                .split('|')
                .map((field1, k) => {
                  if (!message1Segments[i]?.split('|')[k]?.includes(field1)) {
                    const notInMessage2 = !message2.segmentList.filter(
                      (seg) => seg.segmentAbbr === segment.split('|')[0]
                    )[0]
                    const notInMessage1 = !message1.segmentList.filter(
                      (seg) => seg.segmentAbbr === segment.split('|')[0]
                    )[0]
                    return {
                      rowIndex: this.state.message1.segmentList.filter(
                        (seg) => seg.segmentAbbr === segment.split('|')[0]
                      )[0]?.segmentIndex
                        ? this.state.message1.segmentList.filter(
                          (seg) => seg.segmentAbbr === segment.split('|')[0]
                        )[0]?.segmentIndex
                        : this.state.message2.segmentList.filter(
                          (seg) => seg.segmentAbbr === segment.split('|')[0]
                        )[0]?.segmentIndex,
                      field:
                        segment.split('|')[0] +
                        (segment.split('|')[1] &&
                        segment.split('|')[0] !== 'MSH' &&
                        segment.split('|')[0] !== 'EVN'
                          ? '[' + segment.split('|')[1] + ']'
                          : '') +
                        '-' +
                        (segment.split('|')[0] === 'MSH' ? k + 1 : k),
                      fieldDescription: this.state.message2.messageDefinition
                        ?.segments[segment.split('|')[0]]?.fields[
                          segment.split('|')[0] === 'MSH' ? k : k - 1
                        ]?.desc,
                      field1Value:
                        !message1Segments[i]?.split('|')[k] &&
                        message1Segments[i]?.split('|')[k] !== '' &&
                        notInMessage1
                          ? segment.split('|')[0] +
                            ' Segment Missing from Message1'
                          : !message1Segments[i]?.split('|')[k] &&
                            message1Segments[i]?.split('|')[k] !== '' &&
                            notInMessage2
                            ? segment.split('|')[0] +
                            ' Segment Missing from Message 2'
                            : message1Segments[i]?.split('|')[k],
                      field2Value:
                        !field1 && field1 !== '' && notInMessage1
                          ? segment.split('|')[0] +
                            ' Segment Missing from Message1'
                          : !field1 && notInMessage2 && field1 !== ''
                            ? segment.split('|')[0] +
                            ' Segment Missing from Message 2'
                            : field1
                    }
                  } else {
                    return null
                  }
                })
                .filter((el) => !!el)
            )
          )
        const differences = [...message2Differences, ...message1Differences]

        const segDifferences = Array.from(
          new Set(differences.map((a) => a.field))
        ).map((field) => {
          return differences.find((a) => a.field === field)
        })

        this.setState({
          differences: segDifferences
        })
      } else {
        this.setState({
          differences: []
        })
      }
    }
  }

  messageName = ''
  processMessage = (e) => {
    this.messageName = e.currentTarget.id
    this.setState(
      {
        [e.currentTarget.id]: {
          message: e.target.value,
          messageInfo: {
            messageType: e.target.value?.split(/\r?\n/g)[0]?.split('|')[8],
            messageVersion: e.target.value?.split(/\r?\n/g)[0]?.split('|')[11]
          },
          messageDefinition:
            HL7Dictionary.definitions[
              e.target.value?.split(/\r?\n/g)[0]?.split('|')[11]
            ]
        }
      },
      () =>
        this.parseSegments(
          this.state[this.messageName].message,
          this.messageName
        )
    )
  }

  parseSegments = (message, messageName) => {
    const segmentList = message?.split(/\r?\n/g).map((segment, i) => ({
      uuid: uuidv4(),
      segmentIndex: i,
      segmentNumber: i + 1,
      segmentAbbr: segment.split('|')[0]
    }))

    const segments = message
      ?.split(/\r?\n/g)
      .filter((seg) => seg)
      .sort()

    this.setState({
      [messageName]: {
        ...this.state[messageName],
        segments,
        segmentList
      }
    })
  }

  generateMessage = async (messageName) => {
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
            messageType: 'ADT^A31',
            messageVersion: '2.3',
            sendingAppName: 'EPIC',
            sendingFacilityName: 'EPICFACILITY',
            receivingAppName: 'ECLINICALWORKS',
            receivingFacilityName: 'ECWFACILITY',
            processingId: 'T',
            pediatricFlag: false
          })
        }
      )

      const fakeMessage = await getMessageResponse.json()

      this.processMessage({
        currentTarget: {
          id: messageName
        },
        target: {
          value: fakeMessage.segments?.join('\n')
        }
      })
    } catch (err) {
      console.log('Error generating fake message ', err)
      this.setState({ snackbarOpen: true, snackbarMessage: err.message })
    }
  }

  render () {
    const { classes } = this.props
    const { differences, selectedRows, message1, message2 } = this.state
    return (
      <div className={classes.root}>
        <Helmet>
          <meta
            name='description'
            content='Juxtapose compares two HL7 messages and displays the non-matching fields along with the differing values from the given messages.'
          />
          <title>Juxtapose - Compare HL7 messages</title>
          <link rel='canonical' href='https://hl7.cc/juxtapose' />
        </Helmet>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant='h6'>MESSAGE 1</Typography>
            <Box display='flex' margin={0.9}>
              <Button
                variant='contained'
                size='small'
                color='primary'
                className={classes.button}
                onClick={(e) => this.generateMessage('message1')}
              >
                Generate Fake Message
              </Button>
              <div className={classes.messageButtons}></div>
              <Tooltip title='Copy message' aria-label='Copy message 1'>
                <Fab
                  color='primary'
                  size='small'
                  className={classes.button}
                  aria-label='Copy message from box 1'
                  onClick={this.copyMessage1}
                >
                  <FileCopy />
                </Fab>
              </Tooltip>
              <Tooltip title='Paste message' aria-label='Paste message1'>
                <Fab
                  color='primary'
                  size='small'
                  className={classes.button}
                  aria-label='Paste message in box 1'
                  onClick={this.pasteMessage1}
                >
                  <Assignment />
                </Fab>
              </Tooltip>
              <Tooltip title='Clear message' aria-label='clear message 1'>
                <Fab
                  color='primary'
                  size='small'
                  className={classes.button}
                  aria-label='Clear message'
                  onClick={this.clearMessage1}
                >
                  <Clear />
                </Fab>
              </Tooltip>
            </Box>
            <Paper className={classes.paper}>
              <TextField
                id='message1'
                label='Paste your first HL7 Message Here'
                style={{ margin: 8, whiteSpace: 'pre-line' }}
                placeholder={sampleA28.split('\n')[0]}
                fullWidth
                multiline
                margin='normal'
                variant='outlined'
                InputLabelProps={{
                  shrink: true
                }}
                value={message1.message}
                onChange={this.processMessage}
              />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h6'>MESSAGE 2</Typography>
            <Box display='flex' margin={0.9}>
              <Button
                variant='contained'
                size='small'
                color='primary'
                className={classes.button}
                onClick={(e) => this.generateMessage('message2')}
              >
                Generate Fake Message
              </Button>
              <div className={classes.messageButtons}></div>
              <Tooltip title='Copy message' aria-label='Copy message 2'>
                <Fab
                  color='primary'
                  size='small'
                  className={classes.button}
                  aria-label='Copy message from box 1'
                  onClick={this.copyMessage2}
                >
                  <FileCopy />
                </Fab>
              </Tooltip>
              <Tooltip title='Paste message' aria-label='Paste message 2'>
                <Fab
                  color='primary'
                  size='small'
                  className={classes.button}
                  aria-label='Paste message in box 2'
                  onClick={this.pasteMessage2}
                >
                  <Assignment />
                </Fab>
              </Tooltip>
              <Tooltip title='Clear message' aria-label='clear message 1'>
                <Fab
                  color='primary'
                  size='small'
                  className={classes.button}
                  aria-label='Clear message'
                  onClick={this.clearMessage2}
                >
                  <Clear />
                </Fab>
              </Tooltip>
            </Box>
            <Paper className={classes.paper}>
              <TextField
                id='message2'
                label='Paste your second HL7 Message Here'
                style={{ margin: 8, whiteSpace: 'pre-line' }}
                placeholder={sampleA28.split('\n')[0]}
                fullWidth
                multiline
                margin='normal'
                variant='outlined'
                InputLabelProps={{
                  shrink: true
                }}
                value={message2.message}
                onChange={this.processMessage}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography variant='h6'>{`${differences.length} Field Differences`}</Typography>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Field Description</TableCell>
                    <TableCell>HL7 Field</TableCell>
                    <TableCell align='right'>Message 1 Value</TableCell>
                    <TableCell>Message 2 Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {differences &&
                    differences
                      .sort((a, b) => a.rowIndex - b.rowIndex)
                      .map((row, i) => {
                        return (
                          <TableRow
                            key={`${row.field.split('-')[0]}[${i}]-${
                              row.field.split('-')[1]
                            }`}
                            onClick={() =>
                              this.state.selectedRows.indexOf(row.field) === -1
                                ? this.setState({
                                  selectedRows: [
                                    ...this.state.selectedRows,
                                    row.field
                                  ]
                                })
                                : this.setState({
                                  selectedRows: this.state.selectedRows.filter(
                                    (selectedRow) => row.field !== selectedRow
                                  )
                                })
                            }
                            selected={selectedRows.indexOf(row.field) > -1}
                            hover={true}
                            classes={{ selected: classes.selected }}
                            className={classes.tableRow}
                          >
                            <TableCell component='th' scope='row'>
                              {row.fieldDescription}
                            </TableCell>
                            <TableCell component='th' scope='row'>
                              {row.field}
                            </TableCell>
                            <TableCell component='th' scope='row' align='right'>
                              {row.field1Value}
                            </TableCell>
                            <TableCell component='th' scope='row'>
                              {row.field2Value}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default observer(withStyles(styles, { index: 1 })(Juxtapose))
