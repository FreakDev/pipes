export default {
    listen: ({ eventName, forward }, input, context) => {
        return new Promise((resolve => {
            window.setTimeout(function () {
                resolve(context.invoke(forward))
            }, 1000)    
        }))
    }
}