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

  handlePageChange(hash) {
    let show = hash == this.props.hash;
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
  component: PropTypes.any.isRequired
};

exports.Route = Route;