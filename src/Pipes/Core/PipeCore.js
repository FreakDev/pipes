
import factory from "./factory"

export default class PipeCore 
{

    loadJSON(programAsJson) {
        this._program = factory.build(programAsJson)
        return this
    }

    run() {
        this._program.run()
    }

}