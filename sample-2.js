import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  DICTIONARY,
  INPUTS_NAMES,
  ERRORS,
} from 'constants';
import { loginAction, closeLoginPopupAction } from 'store/actions';
import {
  loginStatus,
  wrongLoginStatus,
} from 'store/selectors';
import { Formik } from 'formik';
import {
  NewCustomInput,
  Checkbox,
  LoginIcon2,
} from 'components';
import { bem } from 'utils';
import * as Yup from 'yup';
import Colors from 'styles/colors.json';
import './sample-2.styl';

const sharkGrayColor = Colors['$shark-gray-color'];
const burntSiennaColor = Colors['$burnt-sienna-color'];

const b = bem('login');
const form = bem('form');

const {
  LOGIN,
  FORGOT_PASSWORD,
  DONT_HAVE,
  REGISTER,
  EMAIL,
  PASSWORD,
  REMEMBER_ME,
} = DICTIONARY;

const {
  SHOULD_BE_FILLED,
  INVALID_EMAIL,
  SHORT_PASSWORD,
  WRONG_LOGIN,
} = ERRORS;

const defaultProps = {
  login: () => {},
  changePopup: () => {},
  close: () => {},
  statusLogin: false,
  popupName: {},
  isWrongLogin: false,
  withoutSignup: false,
  className: '',
  redirectLink: null,
};

const propTypes = {
  login: PropTypes.func,
  changePopup: PropTypes.func,
  close: PropTypes.func,
  statusLogin: PropTypes.bool,
  popupName: PropTypes.shape({
    signUp: PropTypes.string,
    forgotPass: PropTypes.string,
  }),
  isWrongLogin: PropTypes.bool,
  withoutSignup: PropTypes.bool,
  className: PropTypes.string,
  redirectLink: PropTypes.string,
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email(INVALID_EMAIL)
    .trim()
    .required(SHOULD_BE_FILLED),
  password: Yup.string()
    .min(6, SHORT_PASSWORD)
    .required(SHOULD_BE_FILLED),
});

class LoginForm extends Component {
  componentWillReceiveProps(nextProps) {
    const { close, statusLogin } = this.props;
    if (nextProps.statusLogin !== statusLogin) {
      close();
    }
  }

  onSubmit = (values) => {
    const { login, redirectLink } = this.props;
    login({ ...values, redirectLink });
  }

  updatePopup = value => () => {
    const { changePopup, close } = this.props;
    changePopup(value);
    close();
  }

  render() {
    const {
      popupName,
      isWrongLogin,
      withoutSignup,
      className,
    } = this.props;
    return (
      <div className={b({ mix: className })}>
        <Formik
          initialValues={{ email: '', password: '', rememberMe: true }}
          validationSchema={schema}
          onSubmit={(values) => {
            const trimmedValues = {
              email: values.email.trim(),
              password: values.password,
              rememberMe: values.rememberMe,
            };
            this.onSubmit(trimmedValues);
          }}
          render={({
            errors,
            handleSubmit,
            touched,
            handleChange,
            values,
          }) => {
            const loginInactive = Object.keys(errors).length && Object.keys(touched).length;
            return (
              <form
                onSubmit={handleSubmit}
                className={b('form', { mix: form() })}
              >
                <fieldset className={b('fieldset')}>
                  <div className={b('login-logo')}>
                    <LoginIcon2
                      width="34px"
                      height="40px"
                      stroke={sharkGrayColor}
                      circleStroke={burntSiennaColor}
                    />
                    <legend className={b('legend', { mix: form('legend') })}>{LOGIN}</legend>
                  </div>
                  <NewCustomInput
                    className={b('input')}
                    onChange={handleChange}
                    name={INPUTS_NAMES.email}
                    placeholder={EMAIL}
                    value={values.email}
                    isTouched={touched.email}
                    error={errors.email}
                    isValid={!errors.email}
                  />
                  <NewCustomInput
                    className={b('input')}
                    onChange={handleChange}
                    name={INPUTS_NAMES.password}
                    placeholder={PASSWORD}
                    type={PASSWORD}
                    value={values.password}
                    isTouched={touched.password}
                    error={errors.password}
                    isValid={!errors.password}
                  />
                  {
                    isWrongLogin && <p className={b('invalid')}>{WRONG_LOGIN}</p>
                  }
                  <div className={b('container')}>
                    <button
                      className={b('forgot')}
                      type="button"
                      onClick={this.updatePopup(popupName.forgotPass)}
                    >
                      {FORGOT_PASSWORD}
                    </button>
                    <Checkbox
                      id={INPUTS_NAMES.rememberMe}
                      name={INPUTS_NAMES.rememberMe}
                      bemParents={b}
                      label={REMEMBER_ME}
                      checked={values.rememberMe}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>
                <button
                  className={b('btn')}
                  type="submit"
                  disabled={loginInactive}
                >
                  {LOGIN}
                </button>
                {!withoutSignup && (
                <p className={b('text')}>
                  {DONT_HAVE}
                  <button
                    className={b('register')}
                    type="button"
                    onClick={this.updatePopup(popupName.signUp)}
                  >
                    {REGISTER}
                  </button>
                </p>
                )}
              </form>
            );
          }}
        />
      </div>
    );
  }
}

LoginForm.propTypes = propTypes;
LoginForm.defaultProps = defaultProps;

const stateProps = state => ({
  statusLogin: loginStatus(state),
  isWrongLogin: wrongLoginStatus(state),
});

const actions = {
  login: loginAction,
  close: closeLoginPopupAction,
};

export default connect(stateProps, actions)(LoginForm);
