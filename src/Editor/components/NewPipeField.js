import React from 'react'

import DEFINITIONS from '../../pipes-definitions.json'

export default class NewPipeField extends React.Component {

    state = {
        fieldValue: "",
        suggestions: []
    }

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onAdd = this.onAdd.bind(this)
    }

    onChange(e) {
        const inputValue = e.target.value
        this.setState({
            fieldValue: inputValue,
            suggestions: Object.keys(DEFINITIONS).filter(def => {
                return def.indexOf(inputValue) !== -1
            })
        })
    }

    onAdd() {
        this.props.onAddPipe({ name: this.state.fieldValue })
        this.setState({
            fieldValue: "",
            suggestions: []
        })
    }

    loadSuggestion(suggestion) {
        this.setState({
            fieldValue: suggestion,
            suggestions: []
        })
    }

    render () {
        const { fieldValue, suggestions } = this.state
        return (
            <div>
                <div class="autocomplete">
                    <ul>
                    { suggestions.map(suggestion => {
                        return (
                            <li onClick={ this.loadSuggestion.bind(this, suggestion) }>
                                { suggestion }
                            </li>
                        )
                    }) }
                    </ul>
                </div>
                <input value={ fieldValue } onChange={ this.onChange } />
                <input type="button" value="add" onClick={ this.onAdd } />
            </div>
        )
    }
}