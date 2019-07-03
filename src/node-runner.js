import fs from "fs"

import PipeCore from "./Pipes/Core/PipeCore"

fs.readFile(__dirname + "/" + process.argv[2], "utf8", function (err, pipeAsJson) {
    const core = (new PipeCore)

    const program = JSON.parse(pipeAsJson)
    core.loadJSON(program)
        .run()
})

