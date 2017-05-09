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
    window.addEventListener("hashchange", this.handleHashChange.bind(this), false);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange.bind(this));
  }

  handleHashChange() {
    let hash = this.getHash();
    this.setState({
      activeHash: hash
    }, () => {
      RouterEmitter.emit('pagechanged', hash);
    });
  }

  render() {
    return(this.props.children);
  }
}

exports.Router = Router;
