import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import { Button, Form, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import uuid from 'uuid';

import Header from './components/layout/Header';
import Todos from './components/Todos';
import About from './components/pages/about';

import './reset.min.css';
import './App.css';

class App extends Component {
  state = {
    todos: [],
    completed: []
  };

  componentDidMount() {
    this.getTodos();
  }

  getTodos() {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/api/v1/',
      headers: { 'Authorization': 'Token 721c50029cd6c2d69a94954ec4180c5e24619743' }
    })
      .then(res => {
        this.setState({ todos: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  delTodo = (id) => {
    console.log(id);
    axios({
      method: 'delete',
      url: `http://127.0.0.1:8000/api/v1/${id}`,
      headers: { 'Authorization': 'Token 721c50029cd6c2d69a94954ec4180c5e24619743' },
    })
      .then(res => this.setState({ todos: [...this.state.todos.filter(todo => todo.id !== id)] }))
      .catch(err => {
        console.log(err)
      });
  }

  markComplete = (id) => {
    this.setState({
      todos: this.state.todos.map(todo => {
        if (todo.id == id) {
          todo.completed = !todo.completed
        }
        return todo;
      })
    });
  }

  addTodo = (title) => {
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8000/api/v1/',
      headers: { 'Authorization': 'Token 721c50029cd6c2d69a94954ec4180c5e24619743', },
      data: {
        title,
        completed: false,
      }
    })
      .then(
        res => this.setState({ todos: [...this.state.todos, res.data] }),
      );
  }

  render() {
    return (
      <Router>
        <Header addTodo={this.addTodo} />
        <Route exact path="/" render={props => (
          <ul className="todo" style={todoListStyle}>
            <Todos
              todos={this.state.todos}
              markComplete={this.markComplete}
              delTodo={this.delTodo}
            />
          </ul>

        )} />
        <Route path="/about" component={About} />
      </Router>
    )
  }
}

const todoListStyle = {
  width: '100%',
  float: 'left',
}

export default App;
