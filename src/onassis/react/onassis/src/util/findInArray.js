//because IE11 does not support .find!!!
function findInArray(array, booleanfunction) {
  if(null == array) {
    console.error("array should not be null")
    return null
  }
  for(var i=0; i<array.length; i++) {
	  var item = array[i]
	  if(booleanfunction(item)) return item 
  }
  return null;
}

//because IE11 does not support .find!!!
function findIndexInArray(array, booleanfunction) {
  for(var i=0; i<array.length; i++) {
	  var item = array[i]
	  if(booleanfunction(item)) return i 
  }
  return -1;
}
export {findInArray, findIndexInArray}