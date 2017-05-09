# React Basic Router
A fast and minimal view router written in react which responds to hash navigation.

## Getting Started

React basic router is just javascript, it can be webpacked or required as you like.

```bash
npm install --save-dev react-basic-router
```

## Example

In this eample, I assume "About" and "MainView" are react components. To load them, simply navigate normally to one of the hash links.

```jsx
import React from 'react';
import { Router, Route, ErrorRoute } from 'react-basic-router';

class App extends React.Component {
	render() {
		return(<div>
			<Router>
				<Route hash="#/" component={MainView} absolute />
				<Route hash="#/about" component={About} title={"Hey look, I can pass props"} />
				<ErrorRoute component={MissingFilePage} />
			</Router>
		</div>);
	}
}
```

* You can add _absolute_ to any route and it will not allow partial parameter matching. Without _absolute_, you can pass in querystring values in addition to the base route and it will still match just fine. In this way, you could navigate to (for example) mysite.com/#docs?findText=example
* All props other than component and hash, will be passed through to the underlying component.
* ErrorRoute will load when a page cannot be matched.



### Built With

* babel
* gulp

To build the project, run the following commands
```shell
npm install --save-dev
npm install -g gulp
gulp
```


### Author

SharpCoder aka Joshua Cole
