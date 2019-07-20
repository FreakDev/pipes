import React, { useState } from "react"
import uuid from "uuid/v4"

const OneOfField = ({
    name,
    label,
    value,
    edit,
    placeholder = "choisir une valeur",
    availableValues,
    validateOnChange,
    onChange,
    onValidate,
    onCancel
}) => {
    const [editMode, setEditMode] = useState(edit)

    const fieldId = name + "_" + uuid()

    const onInputChange = (value) => {
        onChange && onChange(value)

        if (validateOnChange) {
            onValidate(value) !== false && setEditMode(false)
        }
    }

    const onKeyUp = (e) => {
        if (e.keyCode === 13) { // pressed enter
            (!onValidate || onValidate(e.target.value) !== false) && setEditMode(false)
        } else if (e.keyCode === 27) {
            setEditMode(false)
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
                    <select
                        id={ fieldId }
                        autoFocus
                        name={ name }
                        onChange={ (e) => onInputChange(e.target.value) }
                        onKeyUp={ onKeyUp }
                        defaultValue={ value }
                    >
                        {
                            availableValues.map((val, id) => (
                                <option onClick={ (e) => { e.target.innerText !== value && onInputChange(e.target.innerText) } } key={ "onefield_opt_" + id }>{ val }</option>
                            ))
                        }
                    </select>
                </React.Fragment>
            }
        </span>
    )
}

export default OneOfField