import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import createStore from "./store/createStore"

import Editor from "./components/Editor"

import cssClasses from "./index.sass"

const store = createStore()

document.getElementById("root").classList.add(cssClasses.root)
ReactDOM.render(
    <Provider store={store}>
        <Editor />
    </Provider>
    , 
    document.getElementById("root")
)
