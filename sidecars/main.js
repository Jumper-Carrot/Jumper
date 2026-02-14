// main.js
const fs = require('fs')
const path = require('path')

function printUnbuffered(data) {
  process.stdout.write(data)
}

function main() {
  const [, , flag, scriptPath, contextJson] = process.argv
  if (!flag || !scriptPath) {
    console.error('Usage: node main.js -r|-o script.js [context]')
    process.exit(1)
  }

  const absScriptPath = path.resolve(scriptPath)
  let module
  try {
    module = require(absScriptPath)
  } catch (err) {
    console.error('Failed to load script:', err)
    process.exit(1)
  }

  let funcName
  if (flag === '-r') {
    funcName = 'run'
  } else if (flag === '-o') {
    funcName = 'get_options'
  } else {
    console.error('Invalid flag. Use -r for run or -o for get_options.')
    process.exit(1)
  }

  const context = contextJson ? JSON.parse(contextJson) : undefined

  if (typeof module[funcName] === 'function') {
    let result
    try {
      if (module[funcName].length > 0) {
        result = module[funcName](context)
      } else {
        result = module[funcName]()
      }
      if (flag === '-o') {
        printUnbuffered(`${context.id} - options ${JSON.stringify(result)}\n`)
      } else {
        printUnbuffered(`${JSON.stringify(result)}\n`)
      }
    } catch (err) {
      console.error('Error executing function:', err)
      process.exit(1)
    }
  } else {
    console.error(`Script does not have a '${funcName}' function.`)
    process.exit(1)
  }
}

main()
