import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class Header extends Component {
  state = {
    title: ''
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.addTodo(this.state.title);
    this.setState({ title: '' });
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  render() {
    return (
      <header>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Enter an activity.."
            id="item"
            value={this.state.title}
            onChange={this.onChange}
          />
          <button id="add">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path className="fill"
                d="M16,8c0,0.5-0.5,1-1,1H9v6c0,0.5-0.5,1-1,1s-1-0.5-1-1V9H1C0.5,9,0,8.5,0,8s0.5-1,1-1h6V1c0-0.5,0.5-1,1-1 s1,0.5,1,1v6h6C15.5,7,16,7.5,16,8z"
              />
            </svg>
          </button>
        </form>
      </header >
    )
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired,
}

export default Header;