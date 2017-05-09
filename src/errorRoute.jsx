class ErrorRoute extends Route {

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
}

ErrorRoute.propTypes = {
  component: PropTypes.any.isRequired
};

exports.ErrorRoute = ErrorRoute;
