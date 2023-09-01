import App from './App'
import { createRoot } from 'react-dom/client'
import { PrimeReactContext } from 'primereact/api'
//css
import './assets/css/index.css'
import './assets/css/theme.css'

import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import 'primereact/resources/primereact.min.css'

//Redux
import store from './store/store'
import { Provider } from 'react-redux'

//Prime react configuration
PrimeReactContext.locale = 'za'
PrimeReactContext.ripple = true
PrimeReactContext.nonce = '.........'
PrimeReactContext.cssTransition = true
PrimeReactContext.inputStyle = 'outline'

const root = createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
