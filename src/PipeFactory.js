import Pipe, { PIPE_VAR, PIPE_FUNC } from "./Pipe"
import PipeFunc from "./PipeFunc"

export default class PipeFactory {

    build(json) {
        switch (json.type) {
            case PIPE_VAR:
                return new Pipe(json.type, json.name, json.value)
            case PIPE_FUNC:
                return new PipeFunc(json.type, json.name, json.pipes, json.params) 
        }
    }

}
