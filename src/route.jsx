

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
