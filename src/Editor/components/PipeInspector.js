import React from 'react'

import uuid from "uuid/v4"

import NewPipeField from "./NewPipeField"

export const MODE_CREATE = "mode-create"
export const MODE_EDIT = "mode-edit"

import { PIPE_TYPE_NATIVE } from "./Main"

const INITIAL_FIELD_VALUES = {
    name: "",
    type: "",
    params: {}
}

export default class PipeForm extends React.Component {

    state = {
        pipeSpec: null,
        fieldValues: INITIAL_FIELD_VALUES,
        createConnected: false
    }

    static propTypes = {
        onSubmit: "",
        value: "", 
        pipesDefs: "object", 
        mode: ""
    }

    static defaultProps = {
        mode: MODE_CREATE
    }

    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
        this.onAutocomplete = this.onAutocomplete.bind(this)
        this.onNewFieldChange = this.onNewFieldChange.bind(this)
        this.onChangeConnectedCheck = this.onChangeConnectedCheck.bind(this)
    }

    onAutocomplete(value) {
        this.setState({
            pipeSpec: this.props.pipesDefs[value].param,
            fieldValues: { ...INITIAL_FIELD_VALUES, name: value }
        })
    }

    onNewFieldChange(value) {
        this.setState({
            pipeSpec: null,
            fieldValues: { ...INITIAL_FIELD_VALUES, name: value }
        })

    }

    onFieldChange(fieldName, event) {
        const newValues = {...this.state.fieldValues, params:{...this.state.fieldValues.params }}
        newValues.params[fieldName] = event.target.value
        this.setState({
            fieldValues: newValues
        })
    }

    onChangeConnectedCheck(e) {
        this.setState({
            createConnected: e.target.checked
        })
    }

    onSubmit(e) {
        e.preventDefault()

        if (this.isValid()) {
            this.props.onSubmit(this.state.fieldValues, this.state.createConnected)

            this.onNewFieldChange("")
        }
    }

    isValid() {
        return !!this.state.pipeSpec
    }

    renderParamSpec(param) {
        const { pipeSpec } = this.state

        let descriptionParts = pipeSpec[param].split('%s')

        return [descriptionParts[0], <input key={ "pipe_form_ipnut" } name={ param } onChange={ this.onFieldChange.bind(this, param) } />, ...descriptionParts.slice(1)]
    }

    render () {
        const { value, mode, pipesDefs } = this.props
        const { pipeSpec, fieldValues } = this.state

        const connectedCheckId = uuid()

        return (
            <form onSubmit={ this.onSubmit }>
                {
                    mode === MODE_CREATE ?
                        <NewPipeField 
                            value={ fieldValues.name }
                            suggestions={ Object.keys(pipesDefs) } 
                            onLoadSuggestion={ this.onAutocomplete }
                            onChange={ this.onNewFieldChange } />
                        : value.name
                }
                {
                    pipeSpec ? 
                        Object.keys(pipeSpec).map((param, k) => {
                            return <div key={ "pipe_form_spec_" + k }>
                                { this.renderParamSpec(param) }
                            </div>
                        })
                        : null
                }
                {
                    mode === MODE_CREATE ?
                        <div>
                            <input id={ connectedCheckId } onChange={ this.onChangeConnectedCheck } type="checkbox" />
                            <label htmlFor={ connectedCheckId }>Connecté au pipe actif ?</label>
                        </div> 
                        : null
                }
                <input type="submit" disabled={ !this.isValid() } />
            </form>
        )
    }
}