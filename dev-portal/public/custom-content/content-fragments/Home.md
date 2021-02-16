---
title: Home
header: HL7.cc Developer Portal
tagline: Your gateway to healthcare data.
gettingStartedButton: Get Started
apiListButton: Our APIs
---

### EXPLORE AND BUILD

Read the Getting Started guide to learn how to hit the ground running to get an application up and running in no time.

See what tools and APIs we have to offer, including extensive documentation, and sample data.

Sign in to manage your subscriptions, see your current usage, get your API Key, and test against our live API.


### HL7 Tools

#### Farser
HL7 messages are fairly easily readable by humans however since the number of fields in a segment can get lengthy it can some times be difficult to read values between the delimiting pipes.

Farser parses the HL7 message and displays an easy to read table of the Fields, Components, Sub-Components, and Repeating fields. Allowing for easy identification of specific fields as well as the values contained in the particular message fields.

The code parsing the HL7 message pasted into the farser tool is running in your local browser and NO PHI is sent to our servers and NO PHI is stored.
#### Juxtapose
Juxtapose compares two HL7 messages and displays the non-matching fields along with the differing values from the given messages.

Quickly view a list of fields whose contents do not match by populating the MESSAGE 1 and MESSAGE 2 fields with valid HL7 messages.

Click a row in the list of fields with differences to highlight the row to make it stand out.

The code parsing the HL7 messages pasted into the juxtapose tool is running in your local browser and NO PHI is sent to our servers and NO PHI is stored.
#### Rosetta

Rosetta uses the Microsoft FHIR converter API to convert a HL7v2 message or a CDA into a single FHIR resource or a bundle of FHIR resources based on a template of your choosing.

Use Rosetta to:

Convert HL7 messages into FHIR resources
Translate CCDA messages into FHIR resources
Build custom templates to accomadate your data format needs
The message conversion performed by the Rosetta API uses the data from a source HL7 or CDA message to populate a FHIR resourse based on the template selected. Any message data pasted into the rosetta tool is being sent to the API however NO PHI is stored by our servers.
#### Mirage
The Mirage tool can be used to generate common healthcare interoperability message types that contain fake data in commonly used fields.

Use cases include:

* Use Mirage's JSON API to programmatically generate test messages
* Use test messages to populate fake patient data into a database
* Use fake messages to create fake patients on FHIR endpoints
