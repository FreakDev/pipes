import React, { useState } from "react"

import {
    DATATYPE_ARRAY
} from "../../../../constants"

import FreeField from "./FreeField"
import OneOfField from "./OneOfField"
import TypedField from "./TypedField"

import css from "./ArrayForm.sass"

const ArrayForm = ({ name, onValidate, onCancel, value = { cols:[], value:[] }, editOnlyValues = false }) => {

    const [stateValue, setStateValue] = useState(value)

    const onChangeValue = (coord, value) => {
        const newStateValue = stateValue.value
        newStateValue[coord.y][coord.x] = value
        setStateValue({ ...stateValue, value: newStateValue})
    }

    const onChangeColType = (colIdx, type) => {
        setStateValue({ 
            ...stateValue, 
            cols: [
                ...stateValue.cols.slice(0, colIdx), 
                type,
                ...stateValue.cols.slice(colIdx + 1)
            ] 
        })
    }

    const onClickAddCol = (type, before = null) => {
        const newValue = stateValue.value.map(row => [...row, null])
        setStateValue({ cols: [...stateValue.cols, type], value: newValue })
    }

    const onClickRemoveCol = (colIdx) => {
        const newValue = stateValue.value.map(row => [...row.slice(0, colIdx), ...row.slice(colIdx + 1)])
        setStateValue({ 
            cols: [...stateValue.cols.slice(0, colIdx), ...stateValue.cols.slice(colIdx + 1)], 
            value: newValue
        })
    }

    const onClickAddRow = () => {
        const newRow = stateValue.cols.map(col => {
            return null
        })
        setStateValue({ ...stateValue, value: [...stateValue.value, newRow] })
    }

    const onClickRemoveRow = (rowIdx) => {
        const newValue = [...stateValue.value.slice(0, rowIdx), ...stateValue.value.slice(rowIdx + 1)]
        setStateValue({ ...stateValue, value: newValue })
    }

    const onClickCancelTrigger = () => {
        setStateValue(value)
        onCancel && onCancel()
    }

    const onClickValidate = () => {
        onValidate && onValidate({ ...stateValue, __dataType: DATATYPE_ARRAY })
    }

    const NewColMiniForm = ({ onSubmit }) => {

        const [newColType, setNewColType] = useState()

        return <React.Fragment>
            <OneOfField 
                availableValues={ ["Boolean","Number","String"] } 
                validateOnChange={ true } 
                onValidate={ (type) => setNewColType(type) } 
                edit={ false }
                placeholder="select a type"
                value={ newColType }
            />
            &nbsp;<button onClick={ () => newColType && onSubmit(newColType) }>Add col</button>
        </React.Fragment>
    }

    return (<React.Fragment>
        <div>
            Array { name }
        </div>
        <div className={ css.array_form }>
            <ul className={ css.array_cols }>
                { stateValue.cols.map((type, colIdx) => (
                    <li>
                        <OneOfField 
                            availableValues={ ["Boolean","Number","String"] } 
                            validateOnChange={ true } 
                            onValidate={ (type) => onChangeColType(colIdx, type) } 
                            value={ stateValue.cols[colIdx] }
                            edit={ false }
                        />
                    </li>
                )) }
                { !editOnlyValues ? 
                    <li>
                        <NewColMiniForm onSubmit={ onClickAddCol } />
                    </li>
                : null }
            </ul>
            <ul>
                { stateValue.value.map((row, rowIdx) => 
                    <li key={ "row_" + rowIdx } >
                        <ul className={ css.array_row }>
                            { row.map((cell, colIdx) => {
                                return <li><TypedField 
                                    type={ stateValue.cols[colIdx] } 
                                    name={ "cell_" + colIdx + "_" + rowIdx } 
                                    props={ { 
                                        edit: true, 
                                        value: cell, 
                                        onValidate: (v) => onChangeValue({ x: colIdx, y: rowIdx }, v)  
                                    } } 
                                /></li>
                            }) }
                            <li>{/* spacer */}</li>
                        </ul>
                    </li>
                ) }
            </ul>
            { !editOnlyValues ? <button onClick={ onClickAddRow }>Add row</button> : null }
        </div>
        <div>
            <button onClick={ onClickCancelTrigger }>Cancel</button>
            <button onClick={ onClickValidate }>Validate</button>
        </div>
    </React.Fragment>)
}

export default ArrayForm