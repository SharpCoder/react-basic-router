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
    RouterEmitter.removeListener('pagechanged', this.handlePageChange.bind(this));
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

  handlePageChange(hash) {
    let show = this.getBaseHash(hash) == this.getBaseHash(this.props.hash);
    if (show) {
      RouterEmitter.emit("pagefound");
    }

    this.setState({
      shouldShow: show
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
  component: PropTypes.any.isRequired,
  absolute: PropTypes.bool
};

exports.Route = Route;
