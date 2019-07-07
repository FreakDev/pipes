import React, { useState } from "react"
import uuid from "uuid/v4"

import css from "./LookUpField.sass"

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
    sortSuggestionCallback, 
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
    const [selectedSuggestion, setSelectedSuggestion] = useState(0)

    const fieldId = name + "_" + uuid()

    const onInputChange = (e) => {
        setDirty(true)
        setSelectedSuggestion(0)
        setInputValue(e.target.value)
        setIsAutocomplete(false)

        let filteredSuggestions
        if (e.target.value !== "") {
            filteredSuggestions = availableValues
                .filter(autocompleteCallback.bind(this, e.target.value))

            if (sortSuggestionCallback)
                filteredSuggestions.sort(sortSuggestionCallback.bind(this, e.target.value))
        } else {
            filteredSuggestions = availableValues
        }
        setSuggestions(filteredSuggestions)
        onChange && onChange(e.target.value)
    }

    const validateField = (value) => {
        if (!onValidate || onValidate(value) !== false) {
            setEditMode(false)

            if (resetOnValidate) {
                setInputValue("")
            }
        }
    }

    const onKeyUp = (e) => {
        console.log(e.keyCode)
        if (e.keyCode === 13) { // pressed enter
            if (!isAutocomplete) {
                onClickSuggestion(suggestions[selectedSuggestion])
            } else {
                validateField(e.target.value)
            }
        } else if (e.keyCode === 27) {
            setInputValue(value || "")
            setEditMode(false)
            onCancel && onCancel()
        } else if (e.keyCode === 38 || e.keyCode === 40) {
            let newSelection = selectedSuggestion + e.keyCode - 39
            if (newSelection < 0) {
                newSelection = 0
            } else if (newSelection > suggestions.length - 1) {
                newSelection = suggestions.length - 1
            }
            setSelectedSuggestion(newSelection)
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
        if (forceSuggestedValue) {
            validateField(value)
        }
        ref.focus()
    }

    return (
        <div onClick={ onClick }>
            { !editMode ? 
                ( value || placeholder )
                : <React.Fragment>
                    { label ? <label for={ fieldId }>{ label }</label> : null }
                    <div className={ css.suggestions }>
                        <ul>
                            { suggestions.map((suggestion, k) => {
                                return (
                                    <li className={ k === selectedSuggestion ? css.active : "" } onMouseOver={ () => { setSelectedSuggestion(k) } } key={ "lookup_" + fieldId + "_suggestions_" + k } onClick={ () => { onClickSuggestion(suggestion) } }>
                                        { renderSuggestion(suggestion, k === selectedSuggestion ? true : false) }
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
                        autoComplete="false"
                    />
                    { error && !dirty ? <span>{ error }</span> : null }        
                </React.Fragment>
            }
        </div>
    )
}

export const withCustomAutocomplete = (autocompleteCallback) => {
    return (props) => {
        return <LookUpField { ...props } autocompleteCallback={autocompleteCallback } />
    }
}

export default LookUpField