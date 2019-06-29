import React, { useState } from "react"
import uuid from "uuid/v4"

const FreeField = ({ name, label, value, placeholder = "saisir une valeur", error, onChange, onValidate }) => {
    const [dirty, setDirty] = useState(false)
    const [editMode, setEditMode] = useState(false)

    const fieldId = name + "_" + uuid()

    const onInputChange = (e) => {
        setDirty(true)
        onChange && onChange(e.target.value)
    }

    const onKeyUp = (e) => {
        if (e.keyCode === 13) { // pressed enter
            (!onValidate || onValidate(e.target.value) !== false) && setEditMode(false)
        } else if (e.keyCode === 27) {
            setEditMode(false)
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
                        defaultValue={ value } 
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