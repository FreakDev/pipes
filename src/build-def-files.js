const fs = require('fs')

var definitions = {__version: fs.readFileSync(__dirname + '/Pipes/Lib/version', 'utf8')}

fs.readdir(__dirname + '/Pipes/Lib', function(err, items) {

    Promise.all(items.map(function (item) {
        return new Promise((resolve, reject) => {
            fs.readFile(__dirname + '/Pipes/Lib/' + item, 'utf8', function (err, data) {
                matchs = data.match(/\/\*\*\s*\* @PipeDEF\s*.*?(?=\*\/)/gs)

                if (matchs !== null) {
                    let defs = []
                    for (var i=0; i<matchs.length; i++) {
                        var defBlock = matchs[i]

                        defs.push(parseBlock(cleanBlock(defBlock)))
                    }
                    resolve(defs)
                } else {
                    resolve([])
                }
            })
        })
    })).then(function (fileDefs) {
        var contextElems = []
            , contextName = "";

        for(var i= 0; i<fileDefs.length; i++) {
            var fileDef = fileDefs[i];

            let contextElems = [], contextName

            fileDef.forEach(def => {
                if (def.lib) {
                    contextName = def.lib
                } else {
                    definitions[contextName + "." + def.name] = def
                }
            })
        }

        defAsJsonString = JSON.stringify(definitions)
        toFile(__dirname + '/pipes-definitions.json', defAsJsonString);
    })
});


const toFile = (path, content) => {
    fs.writeFile(path, content, 'utf8', (err) => { console.log( err ? 'oups :' + err : 'ok') })
}

const cleanBlock = function (block) {
    block = block.replace('/**', '')
    block = block.trim().split('\n').slice(1).map(part => {
        return part.trim().replace(/\* /, '')
    }).join('\n')
    block = block.replace('  ', ' ')
    block.trim()
    return block
}

const parseBlock = function (block) {
    const blockDef = {}
    block.split('@Pipe\\').forEach(line => {
        let match = line.trim().match(/^(.*?(?= )) (.*)$/s)
        if (match) {
            switch (match[1]) {
                case 'param':
                    const { name, ...param } = parseParamLine(match[2])
                    blockDef.params = blockDef.params || {}
                    blockDef.params[name] = param
                break;
                default:
                    blockDef[match[1]] = match[2]
            }
        }
    })
    return blockDef
}

const parseParamLine = (paramLine) => {
    let parts = paramLine.split('-')

    let name = parts[0].trim()
    let type = "free"
    let optional = false

    nameMatch = name.match(/((\[(.*)\])|(.*))\s+\{(.*)\}/)
    if (nameMatch) {
        if (nameMatch[3])
            name = nameMatch[3]
        else {
            name = nameMatch[1]
        }
        optional = !!nameMatch[3]
        type = nameMatch[3]
    }

    return {
        name,
        type,
        optional,
        description: parts.slice(1).join('-').trim()
    }
}