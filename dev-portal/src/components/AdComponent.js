import React, { PureComponent } from 'react'
import AdSense from 'react-adsense'

export default class AdComponent extends PureComponent {
  render () {
    return (
      <AdSense.Google
        client='ca-pub-9536464575140137'
        slot='6042229015'
        style={{ width: 300, height: 47, float: 'right' }}
        format=''
      />
    )
  }
}
