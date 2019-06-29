import React from 'react'
import uuid from "uuid/v4"

import LookUpField from "./formFields/LookUpField"
import FreeField from "./formFields/FreeField"
import OneOfField from "./formFields/OneOfField"


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
    }

    static defaultProps = {
        label: "Create a pipe"
    }

    constructor(props) {
        super(props)

        this.onSubmit = this.onSubmit.bind(this)
        this.onNameFieldChange = this.onNameFieldChange.bind(this)
        this.onChangeConnectedCheck = this.onChangeConnectedCheck.bind(this)
        this.onParamFieldChange = this.onParamFieldChange.bind(this)
        this.resetSpec = this.resetSpec.bind(this)
    }

    onNameFieldChange(value) {
        this.setState({
            pipeSpec: this.props.pipesDefs[value].params,
            fieldValues: { ...INITIAL_FIELD_VALUES, name: value }

        })
    }

    onParamFieldChange(fieldName, value) {
        const newValues = {...this.state.fieldValues, params:{...this.state.fieldValues.params }}
        newValues.params[fieldName] = value
        this.setState({
            fieldValues: newValues
        })
        if (this.props.value) {
            this.props.onSubmit({ [fieldName]: value })
        }
        return true
    }

    onChangeConnectedCheck(e) {
        this.setState({
            createConnected: e.target.checked
        })
    }

    onSubmit() {
        if (this.isValid()) {
            this.props.onSubmit(this.state.fieldValues, this.state.createConnected)
            if (!this.props.value) {
                this.resetSpec()
            }
        }
    }

    isValid() {
        const v = this.state.fieldValues

        const isEmpty = () => {
            return v.name === "" && v.type === "" && Object.keys(v.params).length === 0
        }

        const specToCheck = this.props.value ? this.props.pipesDefs[this.props.value.name].params : this.state.pipeSpec

        const optionalFieldCheck = specToCheck ? 
            Object.keys(specToCheck).map(specName => {
                return specToCheck[specName].optional || ((this.props.value && !v.params.hasOwnProperty(specName)) || !!v.params[specName])
            }).reduce((p, c) => p && c, true) 
            : true

        return !isEmpty() || optionalFieldCheck
    }

    resetSpec() {
        if (!this.props.value)
            this.setState({
                pipeSpec: null,
                fieldValues: { ...INITIAL_FIELD_VALUES }
            })        
    }

    renderParamField(param, spec, value) {
        let descriptionParts = spec[param].description.split('%s')

        const buildField = (type, props) => {
            switch (type) {
                case "free":
                    return <FreeField key={ "pipe_form_ipnut" } { ...props } />
                case "free":
                        return <OneOfField key={ "pipe_form_ipnut" } { ...props } />
                case "free":
                        return <LookUpField key={ "pipe_form_ipnut" } { ...props } />                        
            }
        }

        return [
            descriptionParts[0], " ",
            buildField(
                spec[param].type, 
                {
                    value: this.state.fieldValues.params[param] || value || "",
                    edit: value ? false : true,
                    name:param,
                    onValidate: this.onParamFieldChange.bind(this, param)
                }
            ), 
            " ", ...descriptionParts.slice(1)
        ]
    }

    render () {
        const { value, mode, pipesDefs, label } = this.props
        const { pipeSpec, fieldValues } = this.state

        const connectedCheckId = "connected_checkbox_" + uuid()
        const specToDisplay = value ? pipesDefs[value.name].params : pipeSpec

        return (
            <fieldset>
                {
                    <legend>{ label }</legend>
                }
                {
                    !value ?
                        <LookUpField 
                            name="name"
                            value={ fieldValues.name || (value && value.name) || ""  }
                            availableValues={ Object.keys(pipesDefs).filter(def => def !== "__version") } 
                            onValidate={ this.onNameFieldChange }
                            onChange={ this.resetSpec }
                            onCancel={ this.resetSpec } />
                        : null
                }
                {
                    specToDisplay ? 
                        Object.keys(specToDisplay).map((paramName, k) => {
                            return <div key={ "pipe_form_param_" + k }>
                                { this.renderParamField(paramName, specToDisplay, value ? value.params[paramName] : null) }
                            </div>
                        })
                        : null
                }
                {
                    !value ? [
                        <div>
                            <input id={ connectedCheckId } onChange={ this.onChangeConnectedCheck } type="checkbox" />
                            <label htmlFor={ connectedCheckId }>Connecté au pipe actif ?</label>
                        </div> ,
                        <input type="submit" onClick={ this.onSubmit } disabled={ !this.isValid() } />
                    ]
                        : null
                }
            </fieldset>
        )
    }
}