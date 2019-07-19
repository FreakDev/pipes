import { combineReducers } from "redux"

import { 
    UX_COPY,
} from "../actions/ux"

const clipboard = (state = [], action) => {
    if (UX_COPY === action.type) {
        state = action.payload
    }
    return state
}

export default combineReducers({
    clipboard
})
