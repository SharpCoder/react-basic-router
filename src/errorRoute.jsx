class ErrorRoute extends React.Component {
  constructor() {
    super();
    this.state = {
      shouldShow: false
    }
  }

  componentDidMount() {
    RouterEmitter.on('shouldshowerror', this.handleShouldShowError.bind(this));
  }

  componentWillUnmount() {
    RouterEmitter.removeListener('shouldshowerror', this.handleShouldShowError.bind(this));
  }

  handleShouldShowError(show) {
    this.setState({
      shouldShow: show
    });
  }

  getComponentProps() {
    let props = Object.assign({}, this.props);
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

ErrorRoute.propTypes = {
  component: PropTypes.any.isRequired
};

exports.ErrorRoute = ErrorRoute;
