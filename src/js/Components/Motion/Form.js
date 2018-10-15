import React from 'react'

class from extends React.Component {
  render() {
    return (
      <form onSubmit={(event) => {
        event.preventDefault()
        this.props.castVote(this.optionId.value)
      }}>
        <div class='form-group'>
          <label>Select option</label>
          <select ref={(input) => this.optionId = input} class='form-control'>
            {this.props.options.map((option) => {
              return <option value={option.id}>{option.name}</option>
            })}
          </select>

          
        </div>
        <button type='submit' class='btn btn-primary'>Vote</button>
        <hr />
      </form>
    )
  }
}

export default from
