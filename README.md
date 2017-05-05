# React Basic Router
A fast and minimal view router written in react which responds to hash navigation.

## Getting Started

React basic router is just javascript, it can be webpacked or required as you like. Find the npm package here: https://www.npmjs.com/package/react-basic-router

This is how you can install it.

```bash
npm install --save-dev react-basic-router
```

## Example

In this eample, I assume "About" and "MainView" are react components. To load them, simply navigate normally to one of the hash links.

```jsx
import React from 'react';
import { Router, Route } from 'react-basic-router';

class App extends React.Component {
	render() {
		return(<div>
			<Router>
				<Route hash="#/about" component={About} />
				<Route hash="#/" component={MainView} />
			</Router>
		</div>);
	}
}
```


### Built With

* babel-cli


### Author

SharpCoder aka Joshua Cole
