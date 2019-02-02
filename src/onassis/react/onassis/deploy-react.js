var fs = require('fs-extra')

try {
  fs.copySync('build', '../../src/main/resources/public/')
  console.log("copy 'build' --> '../../src/main/resources/public/' success!")
} catch (err) {
  console.error(err)
}