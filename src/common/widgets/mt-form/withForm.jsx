import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Form from './Form'
import { getComponentName } from '../../helpers'

function withForm(WrappedInput) {

  class WithForm extends Component {

    constructor(props) {
      super(props)
      this.onChange = this.onChange.bind(this)
    }

    getForm() {
      var form = this.context.form
      if (!form)
        throw new Error('form input component must be defined within Form component')
      return form
    }

    onChange(value) {
      this.getForm().onChange(this.props.field, value)
    }

    render() {
      var { field, ...passThroughProps } = this.props
      var value = this.getForm().getFieldValue(field)
      return <WrappedInput name={field} value={value} onChange={this.onChange} {...passThroughProps} />
    }
  }

  WithForm.displayName = `WithForm(${getComponentName(WrappedInput)})`

  WithForm.contextTypes = {
    form: PropTypes.instanceOf(Form)
  }

  WithForm.propTypes = {
    field: PropTypes.string.isRequired,
  }

  return WithForm
}

export default withForm