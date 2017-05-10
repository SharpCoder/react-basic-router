"use strict";

// Libraries

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Global constants
var EventEmitter = require('events');
var RouterEmitter = new EventEmitter();

/*
  Main router class. use this to contain the <Route /> objects.
  Note: it can be nested.
*/

var Router = function (_React$Component) {
  _inherits(Router, _React$Component);

  function Router() {
    _classCallCheck(this, Router);

    var _this = _possibleConstructorReturn(this, (Router.__proto__ || Object.getPrototypeOf(Router)).call(this));

    _this._isMounted = false;

    _this.handleHashChange = function () {
      if (_this._isMounted) {
        var hash = _this.getHash();
        _this.setState({
          activeHash: hash
        }, function () {
          _this.pageFound = false;
          RouterEmitter.emit('pagechanged', hash);
          RouterEmitter.emit('shouldshowerror', !_this.pageFound);
        });
      }
    };

    _this.handlePageFound = function () {
      _this.pageFound = true;
    };
    return _this;
  }

  _createClass(Router, [{
    key: 'getHash',
    value: function getHash() {
      return window.location.hash;
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.handleHashChange();
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {
      window.addEventListener('hashchange', this.handleHashChange);
      RouterEmitter.on('pagefound', this.handlePageFound);
      this._isMounted = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
      window.removeEventListener('hashchange', this.handleHashChange);
      RouterEmitter.removeListener('pagefound', this.handlePageFound);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        this.props.children
      );
    }
  }]);

  return Router;
}(_react2.default.Component);

exports.Router = Router;

var Route = function (_React$Component2) {
  _inherits(Route, _React$Component2);

  function Route() {
    _classCallCheck(this, Route);

    // Handle page change as variable instead of method so we can
    // bind and unbind it properly to the emitter.
    var _this2 = _possibleConstructorReturn(this, (Route.__proto__ || Object.getPrototypeOf(Route)).call(this));

    _this2.handlePageChange = function (hash) {
      if (_this2._isMounted) {
        var show = _this2.getBaseHash(hash) == _this2.getBaseHash(_this2.props.hash);
        if (show) {
          RouterEmitter.emit("pagefound");
        }

        if (_this2.state.shouldShow !== show) {
          _this2.setState({
            shouldShow: show
          });
        }
      }
    };

    _this2._isMounted = false;
    _this2.state = {
      shouldShow: false
    };
    return _this2;
  }

  _createClass(Route, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      RouterEmitter.on('pagechanged', this.handlePageChange);
      this._isMounted = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
      RouterEmitter.removeListener('pagechanged', this.handlePageChange);
    }
  }, {
    key: 'getBaseHash',
    value: function getBaseHash(hash) {
      var isAbsolute = this.props.absolute;

      if (isAbsolute === undefined || isAbsolute === null) {
        isAbsolute = false;
      }

      if (hash.indexOf('?') >= 0 && !isAbsolute) {
        hash = hash.substr(0, hash.indexOf('?'));
      }

      return hash;
    }
  }, {
    key: 'getComponentProps',
    value: function getComponentProps() {
      var props = Object.assign({}, this.props);
      delete props.hash;
      delete props.component;
      return props;
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.shouldShow) {
        return _react2.default.createElement(this.props.component, this.getComponentProps());
      } else {
        return _react2.default.createElement('div', null);
      }
    }
  }]);

  return Route;
}(_react2.default.Component);

Route.propTypes = {
  hash: _propTypes2.default.string.isRequired,
  component: _propTypes2.default.any.isRequired,
  absolute: _propTypes2.default.bool
};

exports.Route = Route;

var ErrorRoute = function (_Route) {
  _inherits(ErrorRoute, _Route);

  function ErrorRoute() {
    _classCallCheck(this, ErrorRoute);

    var _this3 = _possibleConstructorReturn(this, (ErrorRoute.__proto__ || Object.getPrototypeOf(ErrorRoute)).call(this));

    _this3.handleShouldShowError = function (show) {
      if (_this3._isMounted) {
        _this3.setState({
          shouldShow: show
        });
      }
    };
    return _this3;
  }

  _createClass(ErrorRoute, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      RouterEmitter.on('shouldshowerror', this.handleShouldShowError.bind(this));
      this._isMounted = true;
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
      RouterEmitter.removeListener('shouldshowerror', this.handleShouldShowError.bind(this));
    }
  }, {
    key: 'getComponentProps',
    value: function getComponentProps() {
      var props = Object.assign({}, this.props);
      delete props.component;
      return props;
    }
  }]);

  return ErrorRoute;
}(Route);

ErrorRoute.propTypes = {
  component: _propTypes2.default.any.isRequired
};

exports.ErrorRoute = ErrorRoute;