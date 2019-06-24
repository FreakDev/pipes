import Factory from "./Pipes/Factory"

const pipeAsJson = {
    name: "My first Pipes program",
    type: "pipe-func",
    pipes: [{
        name: "valueToAdd",
        type: "pipe-var",
        value: 4
    },
    {
        name: "firstValueToAdd",
        type: "pipe-var",
        value: 4
    },

    {
        name: "main",
        type: "pipe-func",
        pipes: [{
            name: "event.listen",
            type: "pipe-alias",
            params: {
                eventName: "input",
                invoke: "incValue"
            }
        }]
    },
    
    {
        name: "incValue",
        type: "pipe-func",
        pipes: [{
            name: "stdlib.read",
            type: "pipe-alias",
            params: {
                name: "firstValueToAdd"
            } 
        },
        {
            name: "math.add",
            type: "pipe-alias",
            params: {
                valueToAdd: 1
            }
        },
        {
            name: "stdlib.write",
            type: "pipe-alias",
            params: {
                name: "firstValueToAdd"
            } 
        }
        ,
        {
            name: "stdlib.log",
            type: "pipe-alias",
            params: {
                prefix: "a "
            }
        }
        ,

        {
            name: "stdlib.read",
            type: "pipe-alias",
            params: {
                name: "firstValueToAdd"
            } 
        },
        {
            name: "stdlib.log",
            type: "pipe-alias",
            params: {
                prefix: "b "
            }
        },

        {
            name: "stdlib.invoke",
            type: "pipe-alias",
            params: {
                identifier: "addAValue"
            } 
        }
        ]
    },

    {
        name: "addAValue",
        type: "pipe-func",
        pipes : [{
            name: "stdlib.read",
            type: "pipe-alias",
            params: {
                name: "firstValueToAdd"
            } 
        },
        {
            name: "math.add",
            type: "pipe-alias",
            params: {
                // valueToAdd: 3
                getValueToAdd: { 
                    name: "stdlib.read", 
                    type: "pipe-alias",
                    params: { 
                        name: "valueToAdd" 
                    }
                }
            }
        }
        ,
        {
            name: "stdlib.log",
            type: "pipe-alias",
            params: {
                prefix: "c "
            }
        },
        {
            name: "stdlib.read",
            type: "pipe-alias",
            params: {
                name: "firstValueToAdd"
            } 
        },
        {
            name: "stdlib.log",
            type: "pipe-alias",
            params: {
                prefix: "d "
            }
        }
    ]
    }]
}

const program = (new Factory()).build(pipeAsJson)

program.start();