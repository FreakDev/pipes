import React, { useState } from "react"

import {
    DATATYPE_OBJECT
} from "../../../../constants"


import FreeField from "./FreeField"
import OneOfField from "./OneOfField"
import TypedField from "./TypedField"


const ObjectForm = ({ name, onValidate, onCancel, value = {}, editOnlyValues = false }) => {

    const [stateValue, setStateValue] = useState(value)

    const onChangePropName = (oldName, newName) => {
        const newState = { ...stateValue }

        const propSpec = newState[oldName]
        delete newState[oldName]
        setStateValue({ ...newState, [newName]: propSpec })
    }

    const onChangePropValue = (prop, value) => {
        setStateValue({ ...stateValue, [prop]: { ...stateValue[prop], value } })
    }

    const onChangePropType = (prop, type) => {
        setStateValue({ ...stateValue, [prop]: { type, value: null } })
    }

    const onClickCancelTrigger = () => {
        setStateValue(value)
        onCancel && onCancel()
    }

    const onClickValidate = () => {
        onValidate && onValidate({ ...stateValue, __dataType: DATATYPE_OBJECT })
    }

    const onClickAddProp = () => {
        let newPropNameTmp, 
            i = 1,
            newPropName = "new-prop"

        newPropNameTmp = newPropName
        while (stateValue[newPropNameTmp]) {
            newPropNameTmp = newPropName + "_" + i++
        }
        setStateValue({ ...stateValue, [newPropNameTmp]: {} })
    }

    return (<React.Fragment>
        <div>
            Object { name }
        </div>
        <div>
            <ul>
                { Object.keys(stateValue).map((prop, propIdx) => 
                    <li key={ "prop_" + propIdx } >
                        got a property "{ editOnlyValues ? prop : <FreeField
                            value={ prop || "" }
                            name="prop"
                            onValidate={ (newName) => onChangePropName(prop, newName) }
                            validateOnChange={ true }
                            placeholder="[prop name]"
                            edit={ true }
                        /> }"
                        &nbsp;of type { editOnlyValues ? stateValue[prop].type : <OneOfField 
                            availableValues={ ["Boolean","Number","String"] } 
                            validateOnChange={ true } 
                            onValidate={ (type) => onChangePropType(prop, type) } 
                            value={ stateValue[prop].type }
                            edit={ true }
                        /> }
                        { stateValue[prop].type ? 
                            <React.Fragment>
                                &nbsp;which initial value is <TypedField 
                                    type={ stateValue[prop].type } 
                                    name={ prop } 
                                    props={ { 
                                        edit: !!stateValue[prop].value, 
                                        value: stateValue[prop].value, 
                                        onValidate: (v) => onChangePropValue(prop, v)  
                                    } } 
                                />
                            </React.Fragment>
                            : null }
                    </li>
                ) }
            </ul>
            { !editOnlyValues ? <button onClick={ onClickAddProp }>Add property</button> : null }
        </div>
        <div>
            <button onClick={ onClickCancelTrigger }>Cancel</button>
            <button onClick={ onClickValidate }>Validate</button>
        </div>
    </React.Fragment>)
}

export default ObjectForm