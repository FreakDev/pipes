import factory from "./Pipes/factory"

const pipeAsJson = {
    name: "My first Pipes program",
    type: "pipe-func",
    pipes: 
    
    [{"name":"stdlib.dataEmitter","type":"pipe-native","params":{"value":"Hello "}},{"name":"stdlib.log","type":"pipe-native","params":{"after":"World !!!"}}]
    
    // [
    //     {
    //         name: "main",
    //         type: "pipe-func",
    //         pipes: [{"name":"stdlib.dataEmitter","type":"pipe-native","params":{"value":"ho"}},{"name":"stdlib.log","type":"pipe-native","params":{"prefix":"hey "}}]
    //     }
    // ]
    
    
    
    
    // [{
    //     name: "valueToAdd",
    //     type: "pipe-var",
    //     value: 4
    // },
    // {
    //     name: "firstValueToAdd",
    //     type: "pipe-var",
    //     value: 4
    // },

    // {
    //     name: "main",
    //     type: "pipe-func",
    //     pipes: [{
    //         name: "event.listen",
    //         type: "pipe-native",
    //         params: {
    //             eventName: "input",
    //             invoke: "incValue"
    //         }
    //     }]
    // },
    
    // {
    //     name: "incValue",
    //     type: "pipe-func",
    //     pipes: [{
    //         name: "stdlib.read",
    //         type: "pipe-native",
    //         params: {
    //             name: "firstValueToAdd"
    //         } 
    //     },
    //     {
    //         name: "math.add",
    //         type: "pipe-native",
    //         params: {
    //             valueToAdd: 1
    //         }
    //     },
    //     {
    //         name: "stdlib.write",
    //         type: "pipe-native",
    //         params: {
    //             name: "firstValueToAdd"
    //         } 
    //     }
    //     ,
    //     {
    //         name: "stdlib.log",
    //         type: "pipe-native",
    //         params: {
    //             prefix: "a "
    //         }
    //     }
    //     ,

    //     {
    //         name: "stdlib.read",
    //         type: "pipe-native",
    //         params: {
    //             name: "firstValueToAdd"
    //         } 
    //     },
    //     {
    //         name: "stdlib.log",
    //         type: "pipe-native",
    //         params: {
    //             prefix: "b "
    //         }
    //     },

    //     {
    //         name: "stdlib.invoke",
    //         type: "pipe-native",
    //         params: {
    //             identifier: "addAValue"
    //         } 
    //     }
    //     ]
    // },

    // {
    //     name: "addAValue",
    //     type: "pipe-func",
    //     pipes : [{
    //         name: "stdlib.read",
    //         type: "pipe-native",
    //         params: {
    //             name: "firstValueToAdd"
    //         } 
    //     },
    //     {
    //         name: "math.add",
    //         type: "pipe-native",
    //         params: {
    //             // valueToAdd: 3
    //             getValueToAdd: { 
    //                 name: "stdlib.read", 
    //                 type: "pipe-native",
    //                 params: { 
    //                     name: "valueToAdd" 
    //                 }
    //             }
    //         }
    //     }
    //     ,
    //     {
    //         name: "stdlib.log",
    //         type: "pipe-native",
    //         params: {
    //             prefix: "c "
    //         }
    //     },
    //     {
    //         name: "stdlib.read",
    //         type: "pipe-native",
    //         params: {
    //             name: "firstValueToAdd"
    //         } 
    //     },
    //     {
    //         name: "stdlib.log",
    //         type: "pipe-native",
    //         params: {
    //             prefix: "d "
    //         }
    //     }]
    // }]





}

const program = factory.build(pipeAsJson)

program.run();