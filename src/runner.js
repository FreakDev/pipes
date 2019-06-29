import factory from "./Pipes/factory"

import pipeAsJson from "./pipes-source-2.json"

const program = factory.build(pipeAsJson)

program.run();