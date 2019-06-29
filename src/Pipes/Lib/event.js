export default {
    listen: ({ eventName, forward }, input, context) => {
        window.setTimeout(function () {
            context.invoke(forward)
        }, 1000)
    }
}