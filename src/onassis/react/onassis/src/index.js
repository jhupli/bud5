import React from 'react' // ← Main React library
import { render } from 'react-dom' // ← Main react library
import { Provider } from 'react-redux' //← Bridge React and Redux
import { createStore, applyMiddleware } from 'redux' // ← Main Redux library
import thunk from 'redux-thunk'

//import { MediaQueryProvider } from 'react-media-query-hoc';


//import ReduxFormTutorial from './reduxFormTut'
//import ExamplePage from './components/exampleForm3/ExamplePage'
//import FormPage from './components/editpayments/FormPage'
//import AddPage from './components/payments/add/AddPage'

import rootReducer from './reducers'
import Onassis  from './components/main/Onassis'
import { composeWithDevTools } from 'redux-devtools-extension';

const middleware = [
  thunk,
];

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any:
  //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));




//var FontAwesome = require('react-fontawesome');
//import AddOne from './AddOne'
//import ContactPageContainer from './ContactPageContainer'
//import './index.css';
//var jquery = require('jquery')


//var store = createStore(rootReducer)
//var store = createStore(rootReducer,
	//	applyMiddleware(thunk)
    //,
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
		//,		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())


window.reduxStore = store

/*
render(
		 <MediaQueryProvider>
		 	<Provider store={store}>
				<Onassis />	
			</Provider>
		 </MediaQueryProvider>,
  document.getElementById('root')
);*/
						
						
render(
		 	<Provider store={store}>
				<Onassis />	
			</Provider>,
  document.getElementById('root')
);
