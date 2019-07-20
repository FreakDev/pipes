import React from "react"

import {
    DATATYPE_BOOLEAN,
    DATATYPE_NUMBER,
    DATATYPE_STRING,
    DATATYPE_ARRAY,
    DATATYPE_OBJECT,
    DATATYPE_PIPE
} from "../../../../constants"

import { EDITOR_PARAM_PREFIX } from "../../../constants"

import LookUpField from "./LookUpField"
import FreeField from "./FreeField"
import OneOfField from "./OneOfField"
import ObjectField from "./ObjectField"

const TypedField = ({ type, spec, props, name }) => {
    const paramDisplay = name.indexOf(EDITOR_PARAM_PREFIX) === 0 ? name.substr(EDITOR_PARAM_PREFIX.length) : name

    if ( DATATYPE_BOOLEAN === type ) {
        return <FreeField key={ "pipe_form_ipnut" } { ...props } placeholder={ "[" + paramDisplay + "]" } />
    } else if ( [DATATYPE_STRING, DATATYPE_NUMBER].indexOf(type) !== -1 ) {
        return <FreeField key={ "pipe_form_ipnut" } { ...props } placeholder={ "[" + paramDisplay + "]" } />
    } else if (type.indexOf("OneOf") === 0) {
        const availableChoices = spec.choices
        return <OneOfField key={ "pipe_form_ipnut" } { ...props } availableValues={ availableChoices } placeholder={ "[" + paramDisplay + "]" }  />
    } else if (type.indexOf(DATATYPE_PIPE) === 0) {
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
    } else if ([DATATYPE_OBJECT, DATATYPE_ARRAY].indexOf(type) !== -1) {
        return <ObjectField key={ "pipe_form_ipnut" } { ...props } type={ type } name={ name } />
    }
    return null
}

export default TypedField