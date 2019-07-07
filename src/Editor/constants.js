import { PIPE_TYPE_FUNC, PIPE_TYPE_VAR } from "../constants"

export const EDITOR_PARAM_PREFIX = "#EDITOR#_"

export const MESSAGE_RUNNER_READY = "MessageRunnerReady"

export const MESSAGE_LOAD = "MessageLoad"
export const MESSAGE_START = "MessageStart"
export const MESSAGE_PAUSE = "MessagePause"
export const MESSAGE_RUN_ONE = "MessageRunOne"
export const MESSAGE_RUN = "MessageRun"

export const MODE_NORMAL = "normal"
export const MODE_TURTLE = "turtle"
export const MODE_STEP = "step"


export const TYPE_LABELS = {
    [PIPE_TYPE_FUNC]: "pipe",
    [PIPE_TYPE_VAR]: "box",
}