import React from 'react'

export default class PipeForm extends React.Component {
    

    render () {
        const { value, spec } = this.props

        let params = value ? value.param : spec
        return params.map(param => {
            return <fieldset><<legend>>{ param }</<legend>><input /></fieldset>
        })
    }
}