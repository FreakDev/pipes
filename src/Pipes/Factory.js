import Pipe, { PIPE_VAR, PIPE_FUNC, PIPE_NATIVE } from "./Core/Pipe"
import PipeFunc from "./Core/PipeFunc"

export default {
    build(json, parent) {
        switch (json.type) {
            case PIPE_VAR:
                return new Pipe(json.type, json.id, json.name, json.value, { previous: json.previous })
            case PIPE_FUNC:
            case PIPE_NATIVE:
                return new PipeFunc(json.type, json.id, json.name, json.pipes, { params: json.params, parent, previous: json.previous }) 
        }
    }

}
