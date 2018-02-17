import chai, {expect} from 'chai';
import jsdomify from 'jsdomify';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({
  adapter: new Adapter()
});

const mount = Enzyme.mount;
const shallow = Enzyme.shallow;
const render = Enzyme.render;

chai.should();
let React;
let r;

// Actual test
describe('component', function() {

  let App;

  before(() => {
    jsdomify.create();
    React = require('react');
    r = require('../testfile.jsx');
    require('fbjs/lib/ExecutionEnvironment').canUseDOM = true

    class PageA extends React.Component {
      render() {
        return(<div>Page A</div>);
      }
    }

    class PageB extends React.Component {
      render() {
        return(<div>Page B</div>);
      }
    }

    class PageError extends React.Component {
      render() {
        return(<div>Page Error</div>);
      }
    }

    App = class extends React.Component {
      render() {
        return(
         <r.Router>
          <r.Route hash="#/A" component={PageA} absolute />
          <r.Route hash="#/B" component={PageB} />
          <r.ErrorRoute component={PageError} />
         </r.Router>
        );
      }
    }
  });

  after(() => {
    jsdomify.destroy();
  });

  it('should exist', function() {
    let wrapper = mount(<App />);
    wrapper.find('Router').length.should.equal(1);
    wrapper.unmount();
  });

  it('should support the error page', function() {
    window.location.assign("#/");
    let component = mount(<App />);
    component.text().should.equal("Page Error");
    component.unmount();
  });

  it('should support absolute routing with absolute path', function() {
    window.location.assign("#/A");
    let component = mount(<App />);
    component.text().should.equal("Page A");
    component.unmount();
  });

  it('should support absolute routing with error on weird path', function() {
    window.location.assign("#/A?id=1");
    let component = mount(<App />);
    component.text().should.equal("Page Error");
    component.unmount();
  });

  it('should support fuzzy routing with absolute path', function() {
    window.location.assign("#/B");
    let component = mount(<App />);
    component.text().should.equal("Page B");
    component.unmount();
  });

  it('should support fuzzy routing with weird path', function() {
    window.location.assign("#/B?id=1");
    let component = mount(<App />);
    component.text().should.equal("Page B");
    component.unmount();
  });
});
