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
    window.addEventListener('hashchange', this.handleHashChange.bind(this), false);
    RouterEmitter.on('pagefound', this.handlePageFound.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.handleHashChange.bind(this));
    RouterEmitter.removeListener('pagefound', this.handlePageFound.bind(this));
  }

  handlePageFound() {
    this.pageFound = true;
  }

  handleHashChange() {
    let hash = this.getHash();

    this.setState({
      activeHash: hash
    }, () => {
      this.pageFound = false;
      RouterEmitter.emit('pagechanged', hash);
      RouterEmitter.emit('shouldshowerror', !this.pageFound);
    });
  }

  render() {
    return(this.props.children);
  }
}

exports.Router = Router;
