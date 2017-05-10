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
