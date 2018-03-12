import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import './index.css'
import App from './components/app/App'
import store from './store'
import { unregister as unregisterServiceWorker } from './registerServiceWorker'

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById('root')
)
unregisterServiceWorker()
