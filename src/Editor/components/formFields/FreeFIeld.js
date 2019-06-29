import React, { useState } from "react"
import uuid from "uuid/v4"

const FreeField = ({ 
    name, 
    label, 
    value, 
    placeholder = "saisir une valeur", 
    error, 
    edit,
    resetOnValidate = false,
    onChange, 
    onValidate, 
    onCancel 
}) => {
    const [dirty, setDirty] = useState(false)
    const [editMode, setEditMode] = useState(edit)
    const [stateValue, setStateValue] = useState(value)

    const fieldId = name + "_" + uuid()

    const onInputChange = (e) => {
        setDirty(true)
        setStateValue(e.target.value)
        onChange && onChange(e.target.value)
    }

    const onKeyUp = (e) => {
        if (e.keyCode === 13) { // pressed enter
            if (!onValidate || onValidate(e.target.value) !== false) {
                setEditMode(false)
                if (resetOnValidate) {
                    setStateValue("")
                }
            }
        } else if (e.keyCode === 27) {
            setEditMode(false)
            setStateValue("")
            onCancel && onCancel()
        }
    }

    const onClick = () => {
        !editMode && setEditMode(true)
    }

    return (
        <span onClick={ onClick }>
            { !editMode ? 
                ( value || placeholder )
                : <React.Fragment>
                    { label ? <label for={ fieldId }>{ label }</label> : null }
                    <input 
                        autoFocus 
                        id={ fieldId } 
                        name={ name }                        
                        type="text" 
                        value={ stateValue }
                        placeholder={ placeholder }
                        onChange={ onInputChange } 
                        onKeyUp={ onKeyUp }
                    />
                    { error && !dirty ? <span>{ error }</span> : null }        
                </React.Fragment>
            }
        </span>
    )
}

export default FreeField