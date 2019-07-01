import PipeCore from "./Pipes/Core/PipeCore"

import pipeAsJson from "./pipes-source-2.json"

(new PipeCore)
    .loadJSON(pipeAsJson)
    .run()