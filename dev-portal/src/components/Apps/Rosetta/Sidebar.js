import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Slide,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  IconButton
} from '@material-ui/core'
import {
  Storage, Code, ArrowForwardIos, Help
} from '@material-ui/icons'
import fetch from 'cross-fetch'

import settings from '../../../settings'
import SidebarMenuItem from './SidebarMenuItem'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1)
  },
  nested: {
    paddingLeft: theme.spacing(3)
  },
  iconButton: {
    '& svg': {
      fontSize: 18
    }
  }
}), { index: 1 })

const Sidebar = ({
  depthStep,
  depth,
  setFhirTemplate,
  setConvertMessage,
  fhirTemplate,
  hl7Message,
  setFhirMessage,
  setShowApiDocs,
  showApiDocs,
  setSnackbarOpen,
  setSnackbarMessage,
  toggleHelpDialog
}) => {
  const classes = useStyles()
  const [ccdaTemplateOpen, setCcdaTemplateOpen] = useState(false)
  const [hl7TemplateOpen, setHl7TemplateOpen] = useState(false)
  const [ccdaSampleOpen, setCcdaSampleOpen] = useState(false)
  const [hl7SampleOpen, setHl7SampleOpen] = useState(false)
  const [cdaTemplates, setCdaTemplates] = useState([])
  const [hl7Templates, setHl7Templates] = useState([])
  const [cdaSamples, setCdaSamples] = useState([])
  const [hl7Samples, setHl7Samples] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)

  useEffect(() => {
    const fetchSamples = async (messageType) => {
      try {
        const samplesResonse = await fetch(
          `${settings.rosettaUrl}/api/sample-data`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': settings.anonApiKey,
              Accept: '*/*'
            },
            body: null
          }
        )

        const samples = await samplesResonse.json()

        const hl7v2SampleList = samples.messages.filter(
          (temp) => temp.messageName.split('/')[0] === 'hl7v2'
        )

        const hl7v2SampleResult = []
        const hl7v2Level = { hl7v2SampleResult }

        for (const [j, { messageName, ...rest }] of hl7v2SampleList.entries()) {
          const splitPath = messageName.split('/')
          let last
          splitPath.reduce((r, messageName, i, arr) => {
            if (!r[messageName]) {
              r[messageName] = { hl7v2SampleResult: [] }

              last = {
                sampleId: 'hl7v2Sample-' + (i + j),
                sampleType: 'hl7v2',
                name: messageName,
                label: messageName.includes('.')
                  ? messageName.substring(0, messageName.lastIndexOf('.'))
                  : messageName,
                fullPath: hl7v2SampleList[j].messageName,
                children: r[messageName].hl7v2SampleResult,
                type: 'sample'
              }

              r.hl7v2SampleResult.push(last)
            }

            return r[messageName]
          }, hl7v2Level)

          Object.assign(last, rest)
        }

        setHl7Samples(hl7v2SampleResult)

        const ccdaSampleList = samples.messages.filter(
          (temp) => temp.messageName.split('/')[0] === 'cda'
        )

        const cdaSampleResult = []
        const cdaLevel = { cdaSampleResult }

        for (const [j, { messageName, ...rest }] of ccdaSampleList.entries()) {
          const splitPath = messageName.split('/')
          let last
          splitPath.reduce((r, messageName, i, arr) => {
            if (!r[messageName]) {
              r[messageName] = { cdaSampleResult: [] }

              last = {
                sampleId: 'cdaSample-' + (i + j),
                sampleType: 'cda',
                name: messageName,
                label: messageName.includes('.')
                  ? messageName.substring(0, messageName.lastIndexOf('.'))
                  : messageName,
                fullPath: ccdaSampleList[j].messageName,
                children: r[messageName].cdaSampleResult,
                type: 'sample'
              }

              r.cdaSampleResult.push(last)
            }

            return r[messageName]
          }, cdaLevel)

          Object.assign(last, rest)
        }

        setCdaSamples(cdaSampleResult)
      } catch (err) {
        console.error('Failed to fetch Samples: ', err)
        setSnackbarOpen(true)
        setSnackbarMessage('Failed to load samples list!')
        return []
      }
    }

    const fetchTemplates = async () => {
      try {
        const templatesResonse = await fetch(
          `${settings.rosettaUrl}/api/templates`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-API-Key': settings.anonApiKey
            },
            body: null
          }
        )

        const templates = await templatesResonse.json()

        const hl7v2TemplateList = templates.templates.filter(
          (temp) => temp.templateName.split('/')[0] === 'hl7v2'
        )

        const hl7v2TemplateResult = []
        const hl7v2Level = { hl7v2TemplateResult }

        for (const [
          j,
          { templateName, ...rest }
        ] of hl7v2TemplateList.entries()) {
          const splitPath = templateName.split('/')
          let last
          splitPath.reduce((r, templateName, i, arr) => {
            if (!r[templateName]) {
              r[templateName] = { hl7v2TemplateResult: [] }

              last = {
                templateId: 'hl7v2Template-' + (i + j),
                templateType: 'hl7v2',
                name: templateName,
                label: templateName.includes('.')
                  ? templateName.substring(0, templateName.lastIndexOf('.'))
                  : templateName,
                fullPath: hl7v2TemplateList[j].templateName,
                children: r[templateName].hl7v2TemplateResult,
                type: 'template'
              }

              r.hl7v2TemplateResult.push(last)
            }

            return r[templateName]
          }, hl7v2Level)

          Object.assign(last, rest)
        }

        setHl7Templates(hl7v2TemplateResult)

        const cdaTemplateList = templates.templates.filter(
          (temp) => temp.templateName.split('/')[0] === 'cda'
        )

        const cdaTemplateResult = []
        const cdaLevel = { cdaTemplateResult }

        for (const [j, { templateName, ...rest }] of cdaTemplateList.entries()) {
          const splitPath = templateName.split('/')
          let last
          splitPath.reduce((r, templateName, i, arr) => {
            if (!r[templateName]) {
              r[templateName] = { cdaTemplateResult: [] }

              last = {
                templateId: 'cdaTemplate-' + (i + j),
                templateType: 'cda',
                name: templateName,
                label: templateName.includes('.')
                  ? templateName.substring(0, templateName.lastIndexOf('.'))
                  : templateName,
                fullPath: cdaTemplateList[j].templateName,
                children: r[templateName].cdaTemplateResult,
                type: 'template'
              }

              r.cdaTemplateResult.push(last)
            }

            return r[templateName]
          }, cdaLevel)

          Object.assign(last, rest)
        }

        setCdaTemplates(cdaTemplateResult)
      } catch (err) {
        console.error('Failed to fetch Templates: ', err)
        setSnackbarOpen(true)
        setSnackbarMessage('Failed to load templates list!')
        return []
      }
    }

    fetchSamples()
    fetchTemplates()
  }, [setSnackbarOpen, setSnackbarMessage])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
    switch (event.currentTarget.id) {
      case 'hl7-template':
        setShowApiDocs(false)
        setHl7TemplateOpen(!hl7TemplateOpen)
        break
      case 'cda-template':
        setShowApiDocs(false)
        setCcdaTemplateOpen(!ccdaTemplateOpen)
        break
      case 'hl7-sample':
        setShowApiDocs(false)
        setHl7SampleOpen(!hl7SampleOpen)
        break
      case 'cda-sample':
        setShowApiDocs(false)
        setCcdaSampleOpen(!ccdaSampleOpen)
        break
      case 'api-docs':
        setShowApiDocs(!showApiDocs)
        break
      default:
        break
    }
  }

  const handleClose = () => {
    setCcdaTemplateOpen(false)
    setHl7TemplateOpen(false)
    setCcdaSampleOpen(false)
    setHl7SampleOpen(false)
    setAnchorEl(null)
  }

  const handleItemClick = async (id, type) => {
    // Call correct API with the id (fullpath)
    // Result of call should populate
    //   if type sample then populate message to convert box
    //   if type template then populate fhir template box
    // Close all menus
    try {
      const dataResult = await fetch(
        `${settings.rosettaUrl}/api/${
          type === 'sample' ? 'sample-data' : 'templates'
        }/${id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'txt/xml',
            'X-API-Key': settings.anonApiKey
          }
        }
      )
      const data = await dataResult.text()

      switch (type) {
        case 'sample':
          setConvertMessage(data)
          break
        case 'template':
          setFhirTemplate(data)
          break
        default:
          break
      }

      handleClose()
    } catch (err) {
      console.error('Failed to fetch ' + type + ': ', err)
    }
  }
  return (
    <Slide direction='right' in={true} mountOnEnter unmountOnExit>
      <div className={classes.root}>
        <List component='nav' aria-label='message templates'>
          <ListSubheader>Message Templates</ListSubheader>
          <ListItem button onClick={handleClick} id='hl7-template'>
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary='HL7v2' />
            <IconButton className={classes.iconButton}>
              <ArrowForwardIos />
            </IconButton>
          </ListItem>
          {hl7Templates.length > 0 ? (
            <Menu
              anchorEl={anchorEl}
              open={hl7TemplateOpen}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              MenuListProps={{
                onMouseLeave: handleClose
              }}
              PaperProps={{
                elevation: 4
              }}
            >
              {hl7Templates[0].children.map((item, i) => {
                const { templateId, name, children, fullPath, type } = item
                return (
                  <SidebarMenuItem
                    key={`templateId${i}`}
                    id={templateId + i}
                    name={name}
                    childrenItems={children}
                    onClick={handleItemClick}
                    fullPath={fullPath}
                    apiType={type}
                  />
                )
              })}
            </Menu>
          ) : null}
          <ListItem button onClick={handleClick} id='cda-template'>
            <ListItemIcon>
              <Code />
            </ListItemIcon>
            <ListItemText primary='CCDA' />
            <IconButton className={classes.iconButton}>
              <ArrowForwardIos />
            </IconButton>
          </ListItem>
          {cdaTemplates.length > 0 ? (
            <Menu
              anchorEl={anchorEl}
              open={ccdaTemplateOpen}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              MenuListProps={{
                onMouseLeave: handleClose
              }}
              PaperProps={{
                elevation: 4
              }}
            >
              {cdaTemplates[0].children.map((item, i) => {
                const { templateId, name, children, fullPath, type } = item
                return (
                  <SidebarMenuItem
                    key={`templateId${i}`}
                    id={templateId + i}
                    name={name}
                    childrenItems={children}
                    onClick={handleItemClick}
                    fullPath={fullPath}
                    apiType={type}
                  />
                )
              })}
            </Menu>
          ) : null}
        </List>
        <Divider />
        <List component='nav' aria-label='sample messages'>
          <ListSubheader>Sample Messages</ListSubheader>
          <ListItem button onClick={handleClick} id='hl7-sample'>
            <ListItemIcon>
              <Storage />
            </ListItemIcon>
            <ListItemText primary='HL7v2' />
            <IconButton className={classes.iconButton}>
              <ArrowForwardIos />
            </IconButton>
          </ListItem>
          {hl7Samples.length > 0 ? (
            <Menu
              anchorEl={anchorEl}
              open={hl7SampleOpen}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              MenuListProps={{
                onMouseLeave: handleClose
              }}
              PaperProps={{
                elevation: 4
              }}
            >
              {hl7Samples[0].children.map((item, i) => {
                const { sampleId, name, children, fullPath, type } = item
                return (
                  <SidebarMenuItem
                    key={`sampleId${i}`}
                    id={sampleId + i}
                    name={name}
                    childrenItems={children}
                    onClick={handleItemClick}
                    fullPath={fullPath}
                    apiType={type}
                  />
                )
              })}
            </Menu>
          ) : null}
          <ListItem button onClick={handleClick} id='cda-sample'>
            <ListItemIcon>
              <Code />
            </ListItemIcon>
            <ListItemText primary='CDA' />
            <IconButton className={classes.iconButton}>
              <ArrowForwardIos />
            </IconButton>
          </ListItem>
          {cdaSamples.length > 0 ? (
            <Menu
              anchorEl={anchorEl}
              open={ccdaSampleOpen}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              MenuListProps={{
                onMouseLeave: handleClose
              }}
              PaperProps={{
                elevation: 4
              }}
            >
              {cdaSamples[0].children.map((item, i) => {
                const { sampleId, name, children, fullPath, type } = item
                return (
                  <SidebarMenuItem
                    key={`sampleId${i}`}
                    id={sampleId + i}
                    name={name}
                    childrenItems={children}
                    onClick={handleItemClick}
                    fullPath={fullPath}
                    apiType={type}
                  />
                )
              })}
            </Menu>
          ) : null}
          <Divider />
          <ListItem button onClick={toggleHelpDialog} id='rosetta-help'>
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary='Help' />
            <IconButton className={classes.iconButton}>
              <ArrowForwardIos />
            </IconButton>
          </ListItem>
        </List>
      </div>
    </Slide>
  )
}

export default Sidebar
