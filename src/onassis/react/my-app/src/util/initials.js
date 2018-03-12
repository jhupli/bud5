import {addDays} from './addDays'

const initials = {
		startDate: addDays(new Date(),- 10),
		endDate: addDays(new Date(), 10)
}

export default initials