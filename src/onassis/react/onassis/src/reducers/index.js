import { combineReducers } from 'redux'

import ping from './ping'
import daterange from './daterange'
import minibars from './minibars'
import chart from './chart'
import pie from './pie'
import payments from './payments'
import payment from './payment'
import constants from './constants'
import accounts from './accounts'
import categories from './categories'
import navi from './navi'
import auditlog from './auditlog'
import errorMessage from './errorMessage'

const rootReducer = combineReducers({
  ping,
  daterange,
  minibars,
  chart,
  pie,
  payments,
  payment,
  constants,
  accounts,
  categories,
  navi,
  auditlog,
  errorMessage 
})

export default rootReducer