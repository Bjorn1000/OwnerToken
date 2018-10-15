import React from 'react'
import Table from './Table'
import Form from './Form'

class Content extends React.Component {
  render() {
    return (
      <div>
        <Table options={this.props.options} />
        <hr/>
        { !this.props.hasVoted[1] ?
          <Form options={this.props.options} castVote={this.props.castVote} mintProposals={this.props.mintProposals}
          transferProposals={this.props.transferProposals}/>
          : null
        }
        <p>Your account: {this.props.account}</p>
      </div>
    )
  }
}

export default Content
