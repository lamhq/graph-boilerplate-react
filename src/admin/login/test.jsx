import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Input, Tooltip, Icon, Select, Checkbox, Button,
} from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class RegistrationForm extends React.Component {
  static propsTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    errors: PropTypes.object,
  }

  static defaultProps = {
    initialValues: {},
    errors: {},
    loading: false,
  }

  /**
   * Set initial form values and errors when form mounted
   */
  componentDidMount() {
    const { form, initialValues, errors } = this.props;
    form.setFieldsValue(initialValues);
    this.setErrors(errors);
  }

  /**
   * Set form errors passed from parent component
   * @param {Object} prevProps
   */
  componentDidUpdate(prevProps) {
    const { errors } = this.props;
    if (prevProps.errors !== errors) {
      this.setErrors(errors);
    }
  }

  /**
   * Set form field errors
   * @param {Object} errors
   */
  setErrors(errors) {
    const { form } = this.props;
    Object.entries(errors).forEach(([field, messages]) => {
      form.setFields({
        [field]: {
          value: form.getFieldValue(field),
          errors: [Error(messages[0])],
        },
      });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      // export submit event to outside
      onSubmit(values, this);
    });
  }

  validatePassword = (rule, value, callback) => {
    const { form } = this.props;
    if (form.isFieldTouched('confirmPassword')) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  validateConfirmPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  render() {
    const { form: { getFieldDecorator }, loading } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>,
    );

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          hasFeedback
          label={(
            <span>
              Email&nbsp;
              <Tooltip title="Try to input 'a@m.mm'">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          )}
        >
          {getFieldDecorator('email', {
            rules: [
              { type: 'email', message: 'The input is not valid E-mail!' },
              { required: true, message: 'Please input your E-mail!' },
            ],
            validateTrigger: 'onBlur',
          })(
            <Input />,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Password"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: 'Please input your password!',
            }, {
              validator: this.validatePassword,
            }],
          })(
            <Input type="password" />,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Confirm Password"
          hasFeedback
        >
          {getFieldDecorator('confirmPassword', {
            validateTrigger: 'onBlur',
            rules: [
              { required: true, message: 'Please confirm your password!' },
              { validator: this.validateConfirmPassword },
            ],
          })(
            <Input type="password" />,
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="Phone Number"
          hasFeedback
        >
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please input your phone number!' }],
          })(
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />,
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          {getFieldDecorator('agreement', {
            rules: [{ required: true, message: 'You have to agree with the term & condition' }],
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the &nbsp;
              <a href="#">agreement</a>
            </Checkbox>,
          )}
        </FormItem>

        <FormItem {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            icon="save"
            loading={loading}
          >
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);
export default WrappedRegistrationForm;
