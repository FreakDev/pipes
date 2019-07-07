import { _CONNECTED_TO_ } from "../Core"

/**
 * @PipeDEF
 * @Pipe\lib time
 */
export default {
    /**
     * @PipeDEF
     * @Pipe\name interval
     * @Pipe\type pipe-native
     * @Pipe\param interval - a
     * @Pipe\param count - a
     */
    interval: function ({ interval, count = 1 }, input) {
        return new Promise((resolve, reject) => {
            let nbIter = 0,
                intervalId = setInterval(() => {
                    this.forward({ [_CONNECTED_TO_]: this.id }, input)
                    nbIter++
                    if (nbIter === parseInt(count, 10)) {
                        clearInterval(intervalId)
                    }
                }, parseInt(interval, 10))
            reject()
        })
    }
}