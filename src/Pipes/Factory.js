import Pipe, { PIPE_VAR, PIPE_FUNC, PIPE_ALIAS } from "./Core/Pipe"
import PipeFunc from "./Core/PipeFunc"

export default class Factory {

    build(json, parent) {
        switch (json.type) {
            case PIPE_VAR:
                return new Pipe(json.type, json.name, json.value)
            case PIPE_FUNC:
            case PIPE_ALIAS:
                return new PipeFunc(json.type, json.name, json.pipes, { params: json.params, parent}) 
        }
    }

}
