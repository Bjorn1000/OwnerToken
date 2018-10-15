import React from 'react'

class Table extends React.Component {
  render() {
    return (
      <table class='table'>
        <thead>
          <tr>
            <th>Option</th>
            <th>Votes</th>
          </tr>
        </thead>
        <tbody >
          {this.props.options.map((option) => {
            return(
              <tr>
                <td>{option.name}</td>
                <td>{option.voteCount.toNumber()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
}

export default Table
