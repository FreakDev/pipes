import Pipe, { PIPE_VAR, PIPE_FUNC, PIPE_NATIVE } from "./Pipe"
import PipeFunc from "./PipeFunc"

export default class PipeFactory {
    build(json, parent, runner) {
        switch (json.type) {
            case PIPE_VAR:
                return new Pipe(json.type, json.id, json.name, json.value, { previous: json.previous })
            case PIPE_FUNC:
            case PIPE_NATIVE:
                return new PipeFunc(json.type, json.id, json.name, json.pipes, { params: json.params, parent, previous: json.previous, runner, factory: this }) 
        }
    }

}
