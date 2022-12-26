const fsp = require('fs/promises')
const fs = require('fs-extra')
const { exec } = require('child_process')

const neededItems = [
  {
    'path': '../external_lib/vue-virtual-scroller-source/vue-virtual-scroller',
    'type': 'folder'
  }
]

const checkItems = (item) => {
  item.forEach(element => {
    if (!fs.existsSync(element.path)) {
      throw new Error(`No Target Item: ${element.path}`)
    }
  })
}

const preBuild = async () => {
  if (fs.existsSync('../external_lib')) {
    await fsp.rm('../external_lib', {
      recursive: true,
      force: true
    })
  }
  await fsp.mkdir('../external_lib')
  return new Promise((resolve, reject) => {
    exec('git clone -b fix/dynamic_scroller_item https://github.com/dsjin/vue-virtual-scroller.git vue-virtual-scroller-source', {
      cwd: '../external_lib'
    }, (err) => {
      if (err) {
        reject(err)
        return
      }
      resolve(undefined)
    })
  })
}

const build = async () => {
  return new Promise((resolve, reject) => {
    exec('npm install && npm run local_build', {
      cwd: '../external_lib/vue-virtual-scroller-source'
    }, (err, stdin, stderr) => {
      console.log(stdin, stderr)
      if (err) {
        reject(err)
        return
      }
      resolve(undefined)
    })
  })
}

const preInstall = async () => {
  await preBuild()
  await build()
  checkItems(neededItems)
}

preInstall()
