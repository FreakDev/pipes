export default {
    /**
     * @deprecated
     * @PipeDEF
     * @Pipe\name listen
     * @Pipe\type pipe-native
     * @Pipe\param eventName -
     * @Pipe\param forward -
     */
    listen: function ({ eventName, forward }, input) {
        return new Promise((resolve => {
            window.setTimeout(() => {
                resolve(this.invoke(forward))
            }, 1000)
        }))
    }
}