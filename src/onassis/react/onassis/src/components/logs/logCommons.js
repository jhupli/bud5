
import {fiDateTimeMillis, toFiDBFormat} from '../../util/fiDate'
import currencyFormat  from '../../util/currency'

function chooseValueF(p, field) {
		//'w','o','d','i','s','g','c','a','descr'
    	switch(field) {
	    	case 'w' : return fiDateTimeMillis(p.hd)
	    	case 'op' : {
	    		switch(p.op) {
	    		case 'C' : return 'creation'
	    		case 'U' : return 'modification'
	    		case 'D' : return 'deletion'
	    		default : console.log('UNKONWN op:' + p.op)
	    				  return null
	    		}
	    	}
        case 'dc' : return toFiDBFormat(p.dc)
	    	case 'd' : return toFiDBFormat(p.d)
	    	case 'i' : return currencyFormat(p.i)
	    	case 's' : return p.s ? 'X' : '-'
	    	case 'g' : return p.g
	    	case 'c' : return p.c_descr
	    	case 'a' : return p.a_descr
	    	case 'descr' : return p.descr
	    	default : console.log('UNKONWN field: '+field)
	    			return null
    	}
    	
	}

export {chooseValueF}