"use strict";

// Libraries
import React from 'react';
import PropTypes from 'prop-types';
const EventEmitter = require('events');
const RouterEmitter = new EventEmitter();

/*
  Main router class. use this to contain the <Route /> objects.
  Note: it can be nested.
*/
class Router extends React.Component {

  getHash() {
    return window.location.hash;
  }

  componentDidMount() {
    this.handleHashChange();
  }

  componentWillMount() {
    window.addEventListener("hashchange", this.handleHashChange.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this));
  }

  handleHashChange() {
    let hash = this.getHash();
    this.setState({
      activeHash: hash
    }, () => {
      RouterEmitter.emit('pagechanged', hash);
    });
  }

  render() {
    return(this.props.children);
  }
}

class Route extends React.Component {
  constructor() {
    super();
    this.state = {
      shouldShow: false
    }
  }

  componentDidMount() {
    RouterEmitter.on('pagechanged', this.handlePageChange.bind(this));
  }

  componentWillUnmount() {
    RouteEmitter.removeListener('pagechanged', this.handlePageChange.bind(this));
  }

  handlePageChange(hash) {
    this.setState({
      shouldShow: hash == this.props.hash
    });
  }

  getComponentProps() {
    let props = Object.assign({}, this.props);
    delete props.hash;
    delete props.component;
    return props;
  }

  render() {
    if (this.state.shouldShow) {
      return React.createElement(this.props.component, this.getComponentProps());
    } else {
      return(<div></div>);
    }
  }
}

Route.propTypes = {
  hash: PropTypes.string.isRequired,
  component: PropTypes.any.isRequired
};

exports.Router = Router;
exports.Route = Route;
