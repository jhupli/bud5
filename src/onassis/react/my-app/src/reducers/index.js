import { combineReducers } from 'redux'

import { reducer as formReducer } from 'redux-form'

import ping from './ping'
import dateRange from './daterange'
import minibars from './minibars'
import chart from './chart'
import pie from './pie'
import payments from './payments'
import payment from './payment'
import constants from './constants'
import accounts from './accounts'
import categories from './categories'
import navi from './navi'

const rootReducer = combineReducers({
  ping,
  dateRange,
  minibars,
  chart,
  pie,
  payments,
  payment,
  constants,
  accounts,
  categories,
  navi,
  form: formReducer     // <---- Mounted at 'form'
  
  //,visibilityFilter
})

export default rootReducer