import PipeFactory from "./PipeFactory"

const pipeAsJson = {
    name: "My first Pipes program",
    type: "pipe-func",
    pipes: [{
        name: "valueToAdd",
        type: "pipe-var",
        value: 4
    },

    {
        name: "main",
        type: "pipe-func",
        pipes: [{
            name: "event.listen",
            type: "pipe-func",
            params: {
                eventName: "input",
                invoke: "addAValue"
            }
        }]
    },
    
    {
        name: "addAValue",
        type: "pipe-func",
        pipes : [{
            name: "stdlib.dataEmitter",
            type: "pipe-func",
            params: {
                value: 2
            } 
        },
        {
            name: "math.add",
            type: "pipe-func",
            params: {
                // valueToAdd: 3
                getValueToAdd: { 
                    name: "stdlib.read", 
                    type: "pipe-func",
                    params: { 
                        name: "valueToAdd" 
                    }
                }
            }
        },
        {
            name: "stdlib.log",
            type: "pipe-func"
        }]
    }]
}

const program = (new PipeFactory()).build(pipeAsJson)

program.run();