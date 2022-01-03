#!/usr/bin/env zx
import 'zx/globals'

let fileName = await question('What is the filename? \n')

await $`npm run parse -- --file=${fileName}`

let content = await fs.readFile(`./${fileName}_phone_numbers.txt`)
await $`echo ${content} | sed -e 's/,/\\n/g' -e 's/"//g' -e 's/[][]//g' > ${fileName}_phone_numbers.txt`
