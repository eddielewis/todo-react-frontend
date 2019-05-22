import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from 'react-router-dom';
import axios from 'axios';
import { Button, Form } from "react-bootstrap";

import './reset.min.css';
import './App.css';

class App extends Component {
  state = {
    todos: [],
    completed: [],
    auth_token: '',
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
        if (todo.id === id) {
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

  saveToken = (token) => {
    this.setState({ auth_token: token });
    console.log(this.state.auth_token);
  }

  render() {
    return (
      /*
      <Router history={history}>
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
        <Route
          path="/login"
          render={props => (
            <Login
              history={history}
            />)}
        />
      </Router>
      */
      <Router>
        <div>
          <AuthButton />
          <ul>
            <li>
              <Link to="/public">Public Page</Link>
            </li>
            <li>
              <Link to="/protected">Protected Page</Link>
            </li>
          </ul>
          <Route path="/public" component={Public} />
          <Route path="/login" render={props => <LoginPage token={this.saveToken} {...props} />} />
          <PrivateRoute path="/protected" component={Protected} />
        </div>
      </Router>
    );
  }
}

const Auth = {
  isAuthenticated: false,
  async authenticate(cb, username, password) {
    axios.post('http://127.0.0.1:8000/api/v1/rest-auth/login/', {
      username,
      password
    })
      .then(res => {
        if (res.status === 200) {
          this.isAuthenticated = true;
          cb();
        } else {
          throw (new Error(res.error));
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error logging in please try again');
      });
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  }
}

const AuthButton = withRouter(
  ({ history }) =>
    Auth.isAuthenticated ? (
      <p>Welcome! {" "}
        <button
          onClick={() => {
            Auth.signout(() => history.push("/"));
          }}
        >
          Sign out
          </button>
      </p>
    ) : (
        <p>You are not logged in.</p>
      )
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        Auth.isAuthenticated ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

function Public() {
  return <h3>Public</h3>
}

function Protected() {
  return <h3>Protected</h3>
}

class LoginPage extends Component {
  state = {
    redirectToReferrer: false,
    username: '',
    password: '',
  };

  login = (e) => {
    e.preventDefault();
    Auth.authenticate(() => {
      this.setState({ redirectToReferrer: true });
    },
      this.state.username,
      this.state.password,
    );
  };

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from} />;

    return (
      <Form onSubmit={this.login}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            placeholder="Enter username"
            value={this.props.username}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={this.props.password}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Button type="submit">
          Submit
      </Button>
      </Form>
    );
  }
}

export default App;
