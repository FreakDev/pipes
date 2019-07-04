import React, { useState } from "react"
import uuid from "uuid/v4"

const LookUpField = ({ 
    name, 
    label, 
    value, 
    placeholder = "saisir une valeur", 
    error, 
    edit,
    resetOnValidate = false,
    forceSuggestedValue = true, 
    availableValues = [], 
    autocompleteCallback = (value, suggestion) => {
        return suggestion.indexOf(value) !== -1
    },
    renderSuggestion = (suggestion) => ( suggestion ),
    extractValueFromSuggestion = (suggestion) => ( suggestion ),
    onAutocomplete, 
    onChange, 
    onValidate,
    onCancel
}) => {
    const [dirty, setDirty] = useState(false)
    const [inputValue, setInputValue] = useState(value)    
    const [editMode, setEditMode] = useState(edit)
    const [isAutocomplete, setIsAutocomplete] = useState(false)
    const [suggestions, setSuggestions] = useState([])

    const fieldId = name + "_" + uuid()

    const onInputChange = (e) => {
        setDirty(true)
        setInputValue(e.target.value)
        setIsAutocomplete(false)
        setSuggestions(e.target.value !== "" ? availableValues.filter(autocompleteCallback.bind(this, e.target.value)) : [])
        onChange && onChange(e.target.value)
    }

    const onKeyUp = (e) => {
        if (e.keyCode === 13) { // pressed enter
            if (!forceSuggestedValue || isAutocomplete)
                if (!onValidate || onValidate(e.target.value) !== false) {
                    setEditMode(false)

                    if (resetOnValidate) {
                        setInputValue("")
                    }
                }
        } else if (e.keyCode === 27) {
            setInputValue(value || "")
            setEditMode(false)
            onCancel && onCancel()
        }
    }

    const onClick = () => {
        !editMode && setEditMode(true)
    }

    let ref

    const onClickSuggestion = (suggestion) => {
        setIsAutocomplete(true) 
        const value = extractValueFromSuggestion(suggestion)
        setInputValue(value)
        setSuggestions([])
        onAutocomplete && onAutocomplete(value)
        ref.focus()
    }

    return (
        <span onClick={ onClick }>
            { !editMode ? 
                ( value || placeholder )
                : <React.Fragment>
                    { label ? <label for={ fieldId }>{ label }</label> : null }
                    <div className="autocomplete">
                        <ul>
                            { suggestions.map((suggestion, k) => {
                                return (
                                    <li key={ "lookup_" + fieldId + "_suggestions_" + k } onClick={ () => { onClickSuggestion(suggestion) } }>
                                        { renderSuggestion(suggestion) }
                                    </li>
                                )
                            }) }
                        </ul>
                    </div>                    
                    <input 
                        ref={ r => ref = r }
                        autoFocus 
                        id={ fieldId } 
                        name={ name }
                        value={ inputValue }
                        placeholder={ placeholder }
                        type="text" 
                        onChange={ onInputChange } 
                        onKeyUp={ onKeyUp }
                    />
                    { error && !dirty ? <span>{ error }</span> : null }        
                </React.Fragment>
            }
        </span>
    )
}

export const withCustomAutocomplete = (autocompleteCallback) => {
    return (props) => {
        return <LookUpField { ...props } autocompleteCallback={autocompleteCallback } />
    }
}

export default LookUpField