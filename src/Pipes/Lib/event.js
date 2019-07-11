/**
 * @PipeDEF
 * @Pipe\lib event
 */
export default {
    /**
     * @PipeDEF
     * @Pipe\name onBoxChangeTrigger
     * @Pipe\type pipe-native
     * @Pipe\param boxName {Pipe|pipe-var} - a
     * @Pipe\param trigger {Pipe|pipe-func} - a
     */
    onBoxChangeTrigger: function ({ boxName, trigger }, input) {
        this.addVarListener(boxName, (value) => {
            this.forward(trigger, value)
        })
        return input
    }
}