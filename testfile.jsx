"use strict";

// Libraries
import React from 'react';
import PropTypes from 'prop-types';

// Global constants
const EventEmitter = require('events');
const RouterEmitter = new EventEmitter();

/*
  Main router class. use this to contain the <Route /> objects.
  Note: it can be nested.
*/
class Router extends React.Component {

  constructor() {
    super();
    this._isMounted = false;

    this.handleHashChange = () => {
      if (this._isMounted) {
        let hash = this.getHash();
        this.setState({
          activeHash: hash
        }, () => {
          this.pageFound = false;
          RouterEmitter.emit('pagechanged', hash);
          RouterEmitter.emit('shouldshowerror', !this.pageFound);
        });
      }
    };

    this.handlePageFound = () => {
      this.pageFound = true;
    };
  }

  getHash() {
    return window.location.hash;
  }

  componentDidMount() {
    this.handleHashChange();
  }

  componentWillMount() {
    window.addEventListener('hashchange', this.handleHashChange);
    RouterEmitter.on('pagefound', this.handlePageFound);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('hashchange', this.handleHashChange);
    RouterEmitter.removeListener('pagefound', this.handlePageFound);
  }

  render() {
    return(<div className={this.props.className}>
      {this.props.children}
    </div>);
  }
}

exports.Router = Router;



class Route extends React.Component {
  constructor() {
    super();

    // Handle page change as variable instead of method so we can
    // bind and unbind it properly to the emitter.
    this.handlePageChange = (hash) => {
      if (this._isMounted) {
        let show = this.getBaseHash(hash) == this.getBaseHash(this.props.hash);
        if (show) {
          RouterEmitter.emit("pagefound");
        }

        if (this.state.shouldShow !== show) {
          this.setState({
            shouldShow: show
          });

        }
      }
    };

    this._isMounted = false;
    this.state = {
      shouldShow: false
    }
  }

  componentDidMount() {
    RouterEmitter.on('pagechanged', this.handlePageChange);
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    RouterEmitter.removeListener('pagechanged', this.handlePageChange);
  }

  getBaseHash(hash) {
    let isAbsolute = this.props.absolute;

    if (isAbsolute === undefined || isAbsolute === null) {
      isAbsolute = false;
    }

    if (hash.indexOf('?') >= 0 && !isAbsolute) {
      hash = hash.substr(0, hash.indexOf('?'));
    }

    return hash;
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
  component: PropTypes.any.isRequired,
  absolute: PropTypes.bool
};

exports.Route = Route;

class ErrorRoute extends Route {

  constructor() {
    super();
    this.handleShouldShowError = (show) => {
      if (this._isMounted) {
        this.setState({
          shouldShow: show
        });
      }
    };
  }

  componentDidMount() {
    RouterEmitter.on('shouldshowerror', this.handleShouldShowError.bind(this));
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    RouterEmitter.removeListener('shouldshowerror', this.handleShouldShowError.bind(this));
  }

  getComponentProps() {
    let props = Object.assign({}, this.props);
    delete props.component;
    return props;
  }
}

ErrorRoute.propTypes = {
  component: PropTypes.any.isRequired
};

exports.ErrorRoute = ErrorRoute;
