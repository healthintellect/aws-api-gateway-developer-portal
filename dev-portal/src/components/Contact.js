import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import fetch from 'cross-fetch'

import {
  Header,
  Segment,
  Form,
  Grid,
  Button
} from 'semantic-ui-react'

import settings from '../settings'

const Contact = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [anythingElse, setAnythingElse] = useState('')
  const [assistanceType, setAssistanceType] = useState('')

  const toggleSnackbar = (message) => {
    setSnackbarMessage(message)
    setSnackbarOpen(!snackbarOpen)
  }

  const generateMessage = async (e) => {
    e.preventDefault()
    try {
      const sendMessageResponse = await fetch(`${settings.apiUrl}/mailer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: email,
          to: 'info@healthintellect.com',
          subject: `${firstName} ${lastName} from ${companyWebsite} is requesting assistance with ${assistanceType}`,
          body: anythingElse,
          html: `<p>${anythingElse}</p>`
        })
      })

      const sendMessage = await sendMessageResponse.json()
      toggleSnackbar(sendMessage.message)
    } catch (err) {
      console.log('Error sending email message ', err.message)
    }
  }

  const assistanceTypes = [
    { key: 'Account Setup', value: 'Account Setup', text: 'Account Setup' },
    { key: 'API Question', value: 'API Question', text: 'API Question' },
    { key: 'Development Assistance Request', value: 'Development Assistance Request', text: 'Development Assistance Request' },
    { key: 'Report API Issue', value: 'Report API Issue', text: 'Report API Issue' },
    { key: 'Subscription Assistance', value: 'Subscription Assistance', text: 'Subscription Assistance' },
    { key: 'Support Request', value: 'Support Request', text: 'Support Request' }
  ]

  return (
    <div>
      <Helmet>
        <meta
          name='description'
          content='Contact HL7.cc to find out how we can help with your healthcare development needs.'
        />
        <title>Contact Us - HL7.cc Tools</title>
        <link rel='canonical' href='https://hl7.cc/contact' />
      </Helmet>
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h1' color='#03a9f4' textAlign='center'>
          Contact Us
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input fluid icon='user' iconPosition='left' placeholder='First Name'
                value={firstName}
                onChange={(e) => setFirstName(e.currentTarget.value)} />
              <Form.Input fluid icon='user' iconPosition='left' placeholder='Last Name'
                value={lastName}
                onChange={(e) => setLastName(e.currentTarget.value)}/>
              <Form.Input fluid icon='mail' iconPosition='left' placeholder='E-mail address'
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)} />
              <Form.Input fluid icon='cloud' iconPosition='left' placeholder='Company Website'
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.currentTarget.value)} />
              <Form.Select fluid
                id='assistance-type'
                value={assistanceType}
                onChange={(e) => setAssistanceType(e.target.value)}
                placeholder='Type of Assistance'
                options={assistanceTypes}
              />
              <Form.TextArea fluid placeholder='Anything Else?'
                value={anythingElse}
                onChange={(e) => setAnythingElse(e.currentTarget.value)}
              />

              <Button
                primary
                onClick={generateMessage}
                content='Submit Message'
              />
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default Contact
