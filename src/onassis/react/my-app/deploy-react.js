var fs = require('fs-extra')

try {
  fs.copySync('build', '../../src/main/resources/public/react/build')
  console.log("copy 'build' --> '../../src/main/resources/public/react/build' success!")
} catch (err) {
  console.error(err)
}

