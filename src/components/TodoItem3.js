import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class TodoItem3 extends Component {
  getStyle = () => {
    return {
      background: '#987435',
      padding: '10px',
      borderBottom: '1px #ccc dotted',
      textDecoration: this.props.todo.completed ? 'line-through' : 'none'
    }
  }

  render() {
    const { id, title } = this.props.todo;
    return (
      <div style={this.getStyle()}>
        <p>
          <input type="checkbox"
            onChange={this.props.markComplete.bind(this, id)}
          /> {' '}
          {title}
          <button
            onClick={this.props.delTodo.bind(this, id)}
            style={btnStyle}
          >x</button>
        </p>
      </div>
    )
  }
}

TodoItem3.propTypes = {
  todo: PropTypes.array.isRequired,
  markComplete: PropTypes.func.isRequired,
  delTodo: PropTypes.func.isRequired,
}

const btnStyle = {
  background: '#ff0000',
  color: '#fff',
  border: 'none',
  padding: '5px 13px',
  borderRadius: '50%',
  float: 'right'
}


export default TodoItem3;
