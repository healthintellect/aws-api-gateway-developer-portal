import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sticky from 'react-stickynode'
import HL7Dictionary from 'hl7-dictionary'
import { v4 as uuidv4 } from 'uuid'
import { Helmet } from 'react-helmet'
import { Segment, Table, Grid, Container, Button, Accordion, Form, Icon } from 'semantic-ui-react'

// mobx
import { observer } from 'mobx-react'

import sampleA28 from '../../samples/SampleMessageAdtA28'
import sampleOru from '../../samples/SampleMessageOruR01_1'

const useStyles = {
  root: {
    margin: 9,
    display: 'flex',
    flexDirection: 'column'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 18,
    maxWidth: 450
  },
  textContent: {
    margin: 9
  },
  coreButton: {
    margin: 3,
    marginTop: 0,
    color: 'white'
  },
  messageCard: {
    flex: 1,
    margin: 9
  },
  messageInfoCard: {
    flex: 1
  },
  paper: {
    padding: 18,
    textAlign: 'left',
    color: '#03a9f4'
  },
  tableRow: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#03a9f4 !important',
      '& > .MuiTable.Cell-root': {
        color: 'yellow'
      }
    },
    '&:hover': {
      backgroundColor: '#03a9f4 !important'
    }
  },
  messageButtons: {
    marginLeft: 'auto'
  }
}

const Farser = observer(() => {
  const location = useLocation()
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

  const messageBoxPanel = [
    {
      key: 'messageBox',
      title: 'Message to Parse',
      content: {
        as: Form.TextArea,
        placeholder: 'Paste your HL7 Message Here',
        // placeholder: sampleA28.split('\n')[0],
        value: message,
        onChange: processMessage
      }
    }
  ]

  return (
    <div style={{ backgroundColor: '#e2e2e2' }}>
      <Helmet>
        <meta
          name='description'
          content='Farser is a web based HL7 message viewer that displays fields, components, sub-components, and repeating fields in an easy to read format. '
        />
        <title>Farser - Parse/Read HL7 Messages</title>
        <link rel='canonical' href='https://hl7.cc/farser' />
      </Helmet>
      <Grid>
        <Segment>
          <Grid.Row>
            <Grid.Column width={9}>
              <Button
                primary
                onClick={loadSampleMessage}
              >
                      Sample Message
              </Button>
            </Grid.Column>
            <Grid.Column width={3}>
              <Button.Group>
                <Button icon
                  onClick={copyMessage}>
                  <Icon name='copy' />
                </Button>
                <Button icon
                  onClick={pasteMessage}>
                  <Icon name='paste' />
                </Button>
                <Button icon
                  onClick={clearMessage}>
                  <Icon name='x' />
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={9}>
              {/* <Accordion as={Form.Field} panels={messageBoxPanel} /> */}
              <Form.TextArea
                fluid
                placeholder={sampleA28.split('\n')[0]}
                value={message}
                onChange={processMessage}
              />
            </Grid.Column>
          </Grid.Row>
        </Segment>
        <Grid.Row>
          <Grid.Column width={18}>
            <Segment>
              <h6>Message Information</h6>
              Message Type: {messageInfo && messageInfo.messageType}
              <br />
              Message Version: {messageInfo && messageInfo.messageVersion}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={2}>
            <Segment>
              <h6>Segments</h6>
              <Table basic='very' singleLine collapsing>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Segment Type</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {segmentList &&
                    segmentList.map((row) => {
                      return (
                        <Table.Row
                          key={row.uuid}
                          onClick={() =>
                            parseSelectedSegment(
                              row.segmentNumber,
                              row.segmentAbbr
                            )
                          }
                          selected={selectedSegment === row.segmentNumber}
                        >
                          <Table.Cell component='th' scope='row'>
                            {row.segmentAbbr}
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>
          <Grid.Column width={12}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Segment>
                    <h6>
                      {selectedSegmentAbbr} Fields
                    </h6>
                    <Table basic='very' singleLine collapsing>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>Field #</Table.HeaderCell>
                          <Table.HeaderCell>Field Description</Table.HeaderCell>
                          <Table.HeaderCell>Field</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {fieldList &&
                        fieldList.map((row) => {
                          return (
                            <Table.Row
                              key={row.uuid}
                              onClick={() => parseSelectedField(row.fieldIndex)}

                              selected={selectedField === row.fieldIndex}
                            >
                              <Table.Cell component='th' scope='row'>
                                {row.fieldNumber}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.fieldDescription}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.fieldValue}
                              </Table.Cell>
                            </Table.Row>
                          )
                        })}
                      </Table.Body>
                    </Table>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column>
                        <Segment>
                          <h6>Components</h6>
                          <Table basic='very' singleLine collapsing >
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Component Description</Table.HeaderCell>
                                <Table.HeaderCell>Component</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {componentList &&
                        componentList.map((row) => {
                          return (
                            <Table.Row
                              key={row.uuid}
                              onClick={() =>
                                parseSelectedComponent(row.componentIndex)
                              }

                              selected={
                                selectedComponent === row.componentIndex
                              }
                            >
                              <Table.Cell component='th' scope='row'>
                                {row.componentNumber}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.componentDescription}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.componentValue}
                              </Table.Cell>
                            </Table.Row>
                          )
                        })}
                            </Table.Body>
                          </Table>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Segment>
                          <h6>Sub-Components</h6>
                          <Table basic='very' celled collapsing>
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                <Table.HeaderCell>Sub-Component Description</Table.HeaderCell>
                                <Table.HeaderCell>Sub-Component</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {subcomponentList &&
                        subcomponentList.map((row) => {
                          return (
                            <Table.Row
                              key={row.uuid}

                              selected={
                                selectedField === row.subcomponentIndex
                              }
                            >
                              <Table.Cell component='th' scope='row'>
                                {row.subcomponentNumber}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.subcomponentDescription}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.subcomponentValue}
                              </Table.Cell>
                            </Table.Row>
                          )
                        })}
                            </Table.Body>
                          </Table>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <Segment>
                          <h6>Field Repetition</h6>
                          <Table basic='very' celled collapsing>
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>Field #</Table.HeaderCell>
                                <Table.HeaderCell>Repetition #</Table.HeaderCell>
                                <Table.HeaderCell>Repetition Contents</Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {fieldRepetitionList &&
                        fieldRepetitionList.map((row) => {
                          return (
                            <Table.Row
                              key={row.uuid}

                              selected={selectedField === row.fieldNumber}
                            >
                              <Table.Cell component='th' scope='row'>
                                {row.fieldNumber}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.fieldRepetitionNumber}
                              </Table.Cell>
                              <Table.Cell align='left'>
                                {row.fieldRepetitionValue}
                              </Table.Cell>
                            </Table.Row>
                          )
                        })}
                            </Table.Body>
                          </Table>
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
})

export default Farser
