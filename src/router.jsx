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
    return(<div>
      {this.props.children}
    </div>);
  }
}

exports.Router = Router;
