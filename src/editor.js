import React from 'react'
import ReactDOM from "react-dom"
import Main from "./Editor/components/Main"

import cssClasses from '../sass/Editor/index.sass'

document.getElementById('root').classList.add(cssClasses.root)

ReactDOM.render(<Main />, document.getElementById('root'))
