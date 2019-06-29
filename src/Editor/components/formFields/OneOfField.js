import React, { useState } from "react"
import uuid from "uuid/v4"

const OneOfField = ({ name, label, value, placeholder = "choisir une valeur", availableValues, onChange, onValidate }) => {
    const [editMode, setEditMode] = useState(false)

    const fieldId = name + "_" + uuid()

    const onInputChange = (e) => {
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
                    <select 
                        id={ fieldId }
                        autoFocus
                        name={ name }
                        onChange={ onInputChange } 
                        onKeyUp={ onKeyUp }
                    >
                        {
                            availableValues.map(val => (
                                <option selected={ value === val }>{ val }</option>
                            ))
                        }
                    </select>
                </React.Fragment>
            }
        </span>
    )
}

export default OneOfField