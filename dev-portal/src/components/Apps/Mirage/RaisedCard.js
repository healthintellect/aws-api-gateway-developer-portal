import React, { Component } from 'react'
import { Card } from '@material-ui/core'

class RaisedCard extends Component {
  state = {
    cardRaised: false,
  }

  toggleRaised = () => this.setState({ cardRaised: !this.state.cardRaised })

  render () {
    return (
      <Card
        {...this.props}
        onMouseOver={this.toggleRaised}
        onMouseOut={this.toggleRaised}
        raised={this.state.cardRaised}
      >
        {this.props.children}
      </Card>
    )
  }
}

export default RaisedCard
