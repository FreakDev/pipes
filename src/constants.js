module.exports = {
    PIPE_TYPE_FUNC : "pipe-func",
    PIPE_TYPE_NATIVE : "pipe-native",
    PIPE_TYPE_VAR : "pipe-var",

    // debugger constants
    RUNTIME_PIPE_CALLED : "pipe-called",
    RUNTIME_EXECUTION_STOPPED : "execution-stopped",
    RUNTIME_EXECUTION_STARTED : "execution-started",
    RUNTIME_EXECUTION_IDLE : "execution-idle",
    RUNTIME_EXECUTION_ERROR: "execution-error",

    DEBUGGER_LOG: "debugger-log",

    // server communication
    I_AM_RUNNER : "Runner",
    I_AM_EDITOR : "Editor",
    MESSAGE_I_AM : "IAm",
    MESSAGE_RUNNER_CONNECTED : "RunnerConnected",
    MESSAGE_RUNNER_NOT_CONNECTED : "RunnerNotConnected",
    MESSAGE_CLOSING : "Closing"
}