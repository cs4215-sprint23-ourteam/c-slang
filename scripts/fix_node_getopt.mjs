import * as fs from "fs"
const path = "./node_modules/node-getopt/package.json"
const original = JSON.parse(fs.readFileSync(path))
original.main = undefined
fs.writeFileSync(path, JSON.stringify(original, null, 4))
