export default {
    /**
     * @deprecated
     * @PipeDEF
     * @Pipe\name listen
     * @Pipe\type pipe-native
     * @Pipe\param eventName -
     * @Pipe\param forward -
     */
    listen: ({ eventName, forward }, input, context) => {
        return new Promise((resolve => {
            window.setTimeout(function () {
                resolve(context.invoke(forward))
            }, 1000)
        }))
    }
}