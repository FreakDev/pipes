import React, { useState } from "react"
import uuid from "uuid/v4"

import Modal from "../../Modal"
import ObjectForm from "./ObjectForm"
import ArrayForm from "./ArrayForm"

import {
    PIPE_DATATYPE_OBJECT
} from "../../../../constants"

import css from "./ObjectField.sass"

const ObjectField = ({ 
    name, 
    type,
    onValidate, 
    value
}) => {
    const [editMode, setEditMode] = useState(false)

    const onClickEditTrigger = () => {
        !editMode && setEditMode(true)
    }

    const onFormValidate = (value) => {
        if (onValidate(value)) {
            setEditMode(false)
        }
    }

    const onFormCancel = () => {
        setEditMode(false)        
    }

    let valueAsString
    if (PIPE_DATATYPE_OBJECT === type)
        valueAsString = JSON.stringify(value)
    else {
        valueAsString = (value && value.value) ? JSON.stringify(value.value) : "[empty array]"
    }

    return (
        <span onClick={ onClickEditTrigger }>
            { valueAsString.slice(0, 15) + (valueAsString.length > 15 ? "..." : "") }
            { editMode ? 
                <Modal>
                    <div className={ css.modal_overlay }></div>
                    <div className={ css.modal_wrapper }>
                        <div className={ css.modal }>
                            { PIPE_DATATYPE_OBJECT === type 
                                ? <ObjectForm name={ name } value={ value } onValidate={ onFormValidate } onCancel={ onFormCancel } />
                                : <ArrayForm name={ name } value={ value } onValidate={ onFormValidate } onCancel={ onFormCancel } />
                            }
                        </div>
                    </div>
                </Modal>
                : null
            }
        </span>
    )
}

export default ObjectField