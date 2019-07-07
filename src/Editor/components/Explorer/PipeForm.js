import React from 'react'
import uuid from "uuid/v4"

import LookUpField from "./formFields/LookUpField"
import FreeField from "./formFields/FreeField"
import OneOfField from "./formFields/OneOfField"
import { PIPE_TYPE_FUNC, PIPE_TYPE_VAR } from '../../../constants';
import { EDITOR_PARAM_PREFIX, TYPE_LABELS } from '../../constants'

const INITIAL_FIELD_VALUES = {
    name: "",
    type: "",
    params: {}
}

import css from "./PipeForm.sass"

export default class PipeForm extends React.Component {

    state = {
        pipeSpec: null,
        fieldValues: INITIAL_FIELD_VALUES,
        createConnected: false
    }

    static propTypes = {
        onSubmit: "",
        onRemove: "",
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
            fieldValues: { ...INITIAL_FIELD_VALUES, name: value, type: this.props.pipesDefs[value].type }

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

        const specToCheck = this.getCurrentSpec()

        const optionalFieldCheck = specToCheck ?
            Object.keys(specToCheck).map(specName => {
                return specToCheck[specName].optional || ((this.props.value && !v.params.hasOwnProperty(specName)) || !!v.params[specName])
            }).reduce((p, c) => p && c, true)
            : true

        return !isEmpty() || optionalFieldCheck
    }

    getCurrentSpec() {
        let currentSpec = this.state.pipeSpec
        let value = this.props.value
        if (value) {
            if (this.props.pipesDefs[value.name]) {
                currentSpec = this.props.pipesDefs[value.name].params
            }
            if (value.type === PIPE_TYPE_FUNC) {
                const vars = value.pipes.filter(p => p.type === PIPE_TYPE_VAR)
                currentSpec = {}
                vars.forEach(variable => {
                    currentSpec[variable.name] = {
                        "type": "Pipe",
                        "pipe_type": PIPE_TYPE_VAR,
                        "optional": true,
                        "description": "use box %s to feed pipe parameter '" + variable.name + "'"
                    }
                });
            }

            if (value.type === PIPE_TYPE_VAR) {
                currentSpec = {
                    value: {
                        "type":"Free",
                        "optional": true,
                        "description": "Initial box value : %s"
                    }
                }
            }
        }
        return currentSpec        
    }

    resetSpec() {
        if (!this.props.value)
            this.setState({
                pipeSpec: null,
                fieldValues: { ...INITIAL_FIELD_VALUES }
            })
    }

    renderSuggestion(suggestion, isActive) {
        const lastDotIndex = suggestion.name.lastIndexOf(".")

        return (
            <div className={ [css.suggestion, css[suggestion.type.substr( suggestion.type.lastIndexOf("-") + 1 )]].join(" ") }>
                <span className={ css.suggestion_namespace }>
                    { lastDotIndex !== -1 ? suggestion.name.substr(0, lastDotIndex) : TYPE_LABELS[suggestion.type] }
                </span>
                <p className={ css.suggestion_body }>
                    { lastDotIndex !== -1 ? suggestion.name.substr(lastDotIndex + 1) : suggestion.name }
                    { suggestion.description 
                        && (<React.Fragment>&nbsp;-&nbsp; 
                            { !isActive ? 
                                <span className={ css.suggestion_description_short }>{ suggestion.description.substr(0, 10) + "..." }</span>
                                : <span className={ css.suggestion_description_long }>{ suggestion.description }</span>
                            }</React.Fragment>)
                    }
                </p>
            </div>
        )
    }

    renderParamField(param, spec, value) {
        let descriptionParts = spec[param].description ? spec[param].description.split('%s') : []

        const buildField = (type, spec, props) => {
            const paramDisplay = param.indexOf(EDITOR_PARAM_PREFIX) === 0 ? param.substr(EDITOR_PARAM_PREFIX.length) : param

            if (type.indexOf("Free") === 0) {
                return <FreeField key={ "pipe_form_ipnut" } { ...props } placeholder={ "[" + paramDisplay + "]" } />
            } else if (type.indexOf("OneOf") === 0) {
                const availableChoices = spec.choices
                return <OneOfField key={ "pipe_form_ipnut" } { ...props } availableValues={ availableChoices } placeholder={ "[" + paramDisplay + "]" }  />
            } else if (type.indexOf("Pipe") === 0) {
                return <LookUpField
                    key={ "pipe_form_ipnut" }
                    { ...props }
                    availableValues={ this.props.pipesInScope }
                    autocompleteCallback={(value, suggestion) => {
                        return suggestion.type === spec.pipe_type && suggestion.name.indexOf(value) !== -1
                    }}
                    renderSuggestion={ this.renderSuggestion }
                    extractValueFromSuggestion={ suggestion => suggestion.name }
                    placeholder={ "[" + paramDisplay + "]" }
                />
            }
        }

        return [
            descriptionParts[0], " ",
            buildField(
                spec[param].type,
                spec[param],
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
        const { value, mode, pipesDefs, label, onRemove } = this.props
        const { fieldValues } = this.state

        const connectedCheckId = "connected_checkbox_" + uuid()
        const specToDisplay = this.getCurrentSpec()
        
        return (
            <fieldset className={ [css.pipe_form, value ? css.mode_edit : css.mode_create].join(" ") }>
                {
                    <legend>{ label }</legend>
                }
                {
                    !value ?
                        <LookUpField
                            name="name"
                            value={ fieldValues.name || (value && value.name) || ""  }
                            availableValues={ Object.keys(pipesDefs).filter(def => def !== "__version").map(def => ( { ...pipesDefs[def], name: def } ) ) }
                            autocompleteCallback={(value, suggestion) => {
                                return !!suggestion.name.match(value)
                            }}
                            renderSuggestion={ this.renderSuggestion }
                            extractValueFromSuggestion={ suggestion => suggestion.name }
                            onValidate={ this.onNameFieldChange }
                            onChange={ this.resetSpec }
                            onCancel={ this.resetSpec } />
                        : null
                }
                {
                    specToDisplay ?
                        Object.keys(specToDisplay).map((paramName, k) => {
                            return <div key={ "pipe_form_param_" + k }>
                                { this.renderParamField(paramName, specToDisplay, value && value.params ? value.params[paramName] : null) }
                            </div>
                        })
                        : null
                }
                {
                    !value ? [
                        <div key={ "pipeform_button_1" } >
                            <input id={ connectedCheckId } onChange={ this.onChangeConnectedCheck } type="checkbox" />
                            <label htmlFor={ connectedCheckId }>Connect to focused pipe ?</label>
                        </div> ,
                        <input key={ "pipeform_button_2" } type="submit" onClick={ this.onSubmit } disabled={ !this.isValid() } value="Create" />
                    ]
                    : [
                        <input key={ "pipeform_button_2" } type="button" onClick={ onRemove } value="Remove" />
                    ]
                }
            </fieldset>
        )
    }
}