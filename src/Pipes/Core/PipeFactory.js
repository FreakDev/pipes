import { PIPE_TYPE_VAR, PIPE_TYPE_FUNC, PIPE_TYPE_NATIVE } from "../../constants"

import Pipe from "./Pipe"
import PipeFunc from "./PipeFunc"

export default class PipeFactory {
    build(json, parent, runner) {
        switch (json.type) {
        case PIPE_TYPE_VAR:
            return new Pipe(
                json.type, 
                json.id, 
                json.name, 
                { 
                    params: json.params, 
                    previous: json.previous 
                }
            )
        case PIPE_TYPE_FUNC:
        case PIPE_TYPE_NATIVE:
            return new PipeFunc(
                json.type, 
                json.id, 
                json.name, 
                { 
                    params: json.params, 
                    previous: json.previous, 
                    value: json.pipes, 
                    parent, 
                    runner, 
                    factory: this 
                }
            ) 
        }
    }

}
