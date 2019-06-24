export default {
    listen: ({ eventName, invoke }, input, context) => {
        window.setTimeout(function () {
            context.invoke(invoke)
        }, 1000)
    }
}