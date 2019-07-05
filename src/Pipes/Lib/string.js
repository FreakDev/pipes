/**
 * @PipeDEF
 * @Pipe\lib string
 */
export default {
    /**
     * @PipeDEF
     * @Pipe\name concat
     * @Pipe\type pipe-native
     * @Pipe\description concatenate two strings together
     * @Pipe\param withString {Free} - This pipe will output the input value concatenate with %s or (if left empty)
     * @Pipe\param withVar {Pipe|pipe-var} - the value from the box %s
     * @Pipe\param [isBefore] {OneOf[before,after]} -  placed %s it
     */
    concat: function ({ withString, withVar, isBefore = "after" }, input) {
        const IS_BEFORE = isBefore === "before"
        const stringToConcat = withString || this.getVarValue(withVar)
        return "" + (IS_BEFORE ? stringToConcat : "") + input + (IS_BEFORE ? "" : stringToConcat)
    },

    /**
     * @PipeDEF
     * @Pipe\name chatAt
     * @Pipe\type pipe-native
     * @Pipe\description output the charachter from the string (parameter) at inputed position (string starts at 0)
     * @Pipe\param stringValue {Free} - Will output the character at inputed position from the string %s or (if left empty)
     * @Pipe\param varValue {Pipe|pipe-var} - the one from the box %s
     */
    charAt: function ({ stringValue, varValue }, input) {
        return (stringValue || this.getVarValue(varValue))[input]
    },

    /**
     * @PipeDEF
     * @Pipe\name subString
     * @Pipe\type pipe-native
     * @Pipe\description substract a part of a string
     * @Pipe\param stringValue {Free} - Will output a sub-string of the string %s or (if left empty)
     * @Pipe\param varValue {Pipe|pipe-var} - the one from the box %s,
     * @Pipe\param from {Pipe|pipe-var} - taken from position %s (if negative starts from the end of the string), and on inputed length
     */
    subString: function ({ stringValue, varValue, from }, input) {
        (stringValue || this.getVarValue(varValue)).substr(from, input)
        return
    }
}