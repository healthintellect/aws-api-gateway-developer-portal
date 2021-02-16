// Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import { Helmet } from 'react-helmet'

// mobx
import { observer } from 'mobx-react'

// fragments
import { fragments } from 'services/get-fragments'

// semantic-ui
import { Container } from 'semantic-ui-react'

export default observer(() => (
  <Container style={{ padding: '40px' }}>
    <Helmet>
      <title>Getting Started - HL7.cc Tools</title>
      <meta
        name="description"
        content="To use any of the HL7.cc APIs you must create a developer account. A developer account provides an API Key for accessing our APIs, a playground for testing our APIs, and API usage metrics. Register or sign in using the buttons in the top right."
      />
      <link rel="canonical" href="https://hl7.cc/getting-started" />
    </Helmet>
    <fragments.GettingStarted.jsx />
  </Container>
))
