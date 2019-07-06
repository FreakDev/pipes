export const __sortInChainOrder = (pipes) => {
    let chains = pipes.filter(p => {
        return pipes.find(e => e.id === p.previous) === undefined
    }).map(headPipe => {
        let chain = [],
            cur = headPipe
        do {
            chain.push(cur)
            cur = pipes.find(p => p.previous === cur.id)
        } while(cur)
        return chain
    })
    return chains.reduce((p, c) => [...p, ...c], [])
}

export const __dir = (path) => {
    let newPath = path.slice()
    while(typeof newPath[newPath.length - 1] !== "string") newPath.pop()
    return newPath
}

export const __resolvePath = (context, path) => {
    let base = context
    for(let idx = 0, len = path.length; idx < len; idx++) {
        let curPath = path[idx]
        if (typeof curPath !== "string")
            curPath = base.findIndex(e => e.id === curPath.id)

        base = base[curPath]

        if (base === undefined)
            return undefined
    }
    return base
}