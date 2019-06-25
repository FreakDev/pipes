import React from 'react'

import DEFINITIONS from '../../pipes-definitions.json'

import PipeForm from './PipeForm'

export default class NewPipeField extends React.Component {

    state = {
        fieldValue: "",
        suggestions: [],
        loadedSuggestion: null
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
                return def !== "__version" && def.indexOf(inputValue) !== -1
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
        console.log(DEFINITIONS[suggestion].param);
        this.setState({
            fieldValue: suggestion,
            suggestions: [],
            loadedSuggestion: DEFINITIONS[suggestion]
        })
    }

    render () {
        const { fieldValue, suggestions, loadedSuggestion } = this.state
        return (
            <React.Fragment>
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
                {
                    loadedSuggestion ?
                        <PipeForm spec={ loadedSuggestion.param } />
                        : null
                }
            </React.Fragment>
        )
    }
}