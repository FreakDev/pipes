import React from 'react'

import Menu from './Menu'
import MainView from './MainView'
import Toolbox from './Toolbox'

export default class Main extends React.Component {
    
    state = {
        focused: null,
        name: "",
        chain: [

        ]
    }

    constructor(props) {
        super(props)

        this.onAddPipe = this.onAddPipe.bind(this)
    }

    onAddPipe(pipe) {
        this.setState({
            chain: [...this.state.chain, pipe]
        })
    }

    render() {
        const { name, chain, focused } = this.state

        return (
            <React.Fragment>
                <Menu />
                <h1>{ name }</h1>
                <MainView chain={ chain } />
                <Toolbox selected={ focused ? chain[focused] : null } onAddPipe={ this.onAddPipe } />
            </React.Fragment>
        )
    }
}