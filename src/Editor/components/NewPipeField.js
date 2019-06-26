import React from 'react'

import PipeForm from './PipeForm'

export default class NewPipeField extends React.Component {

    state = {
        fieldValue: "",
        suggestions: [],
        isAutocomplete: false
    }

    static propTypes = {
        suggestions: "array<string>",
        onLoadSuggestion: "",
        onChange: "[OPT] callback"
    }

    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        const inputValue = e.target.value
        this.setState({
            isAutocomplete: false,
            fieldValue: inputValue,
            suggestions: this.props.suggestions.filter(def => {
                return def !== "__version" && def.indexOf(inputValue) !== -1
            })
        })
        this.props.onChange && this.props.onChange(inputValue)
    }

    loadSuggestion(suggestion) {
        this.setState({
            isAutocomplete: true,
            fieldValue: suggestion,
            suggestions: [],
        })
        this.props.onLoadSuggestion(suggestion)
    }

    render () {
        const { fieldValue, suggestions, loadedSuggestion } = this.state
        return (
            <React.Fragment>
                <div>
                    <div class="autocomplete">
                        <ul>
                        { suggestions.map((suggestion, k) => {
                            return (
                                <li key={ "new_pipe_field_suggestions_" + k } onClick={ this.loadSuggestion.bind(this, suggestion) }>
                                    { suggestion }
                                </li>
                            )
                        }) }
                        </ul>
                    </div>
                    <input value={ fieldValue } onChange={ this.onChange } />
                </div>
            </React.Fragment>
        )
    }
}