//because IE11 does not support .find!!!
function findInArray(array, booleanfunction) {
  for(var i=0; i<array.length; i++) {
	  var item = array[i]
	  if(booleanfunction(item)) return item 
  }
  return null;
}

export default findInArray