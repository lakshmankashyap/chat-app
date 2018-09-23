import React, { Component } from 'react';
import { connect } from 'react-redux';
import Container from 'muicss/lib/react/container';
import {
  Form,
  Row,
  Col,
  Panel,
  Divider,
  Input
} from 'muicss/react';
import mapDispatchToProps from '../../actions';
import Head from '../../../components/Head';
import {
  UsernameInput,
  PasswordInput,
  LoginButton,
  RegisterButton,
  SocialButton
} from '../../components/Form';
import { Alert } from '../../../components/Alert';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };
  }
  componentWillMount() {
    document.body.className = '';
    document.body.classList.add('login-page');
  }
  handleChange(event) {
    event.preventDefault();

    this.setState({[event.target.name]: event.target.value});
  }
  handleHeadData() {
    const title = 'Chat App | Login';

    return (
      <Head title={title} />
    )
  }
  handleLocalLogin(event) {
    event.preventDefault();

    const { localLogin } = this.props;
    const {
      username,
      password
    } = this.state;

    localLogin(username, password);
  }
  render() {
    const {
      facebookLogin,
      googleLogin,
      twitterLogin,
      instagramLogin,
      linkedinLogin,
      githubLogin,
      auth
    } = this.props;
    const {
      username,
      password
    } = this.state;

    return (
      <div>
        {::this.handleHeadData()}
        <Panel className="form-card">
          <Row>
            <Col md="12">
              <h1 className="mui--text-center">Chat App</h1>
            </Col>
            {
              auth.isLoginError &&
              <Col md="12">
                <Alert label="Invalid username or password!" center />
              </Col>
            }
            <Col md="12">
              <Form onSubmit={::this.handleLocalLogin}>
                <UsernameInput
                  value={username}
                  handleChange={::this.handleChange}
                  isDisabled={auth.isLoading}
                />
                <PasswordInput
                  value={password}
                  handleChange={::this.handleChange}
                  isDisabled={auth.isLoading}
                />
                <LoginButton isDisabled={auth.isLoading} />
              </Form>
            </Col>
            <Col md="12">
              <SocialButton
                socialMedia="facebook"
                socialMediaIcon="facebook-f"
                label="Login with Facebook"
                handleSocialLogin={facebookLogin}
                isDisabled={auth.isLoading}
              />
            </Col>
            <Col md="12">
              <SocialButton
                socialMedia="google"
                socialMediaIcon="google"
                label="Login with Google"
                handleSocialLogin={googleLogin}
                isDisabled={auth.isLoading}
              />
            </Col>
            <Col md="12">
              <SocialButton
                socialMedia="twitter"
                socialMediaIcon="twitter"
                label="Login with Twitter"
                handleSocialLogin={twitterLogin}
                isDisabled={auth.isLoading}
              />
            </Col>
            <Col md="12">
              <SocialButton
                socialMedia="instagram"
                socialMediaIcon="instagram"
                label="Login with Instagram"
                handleSocialLogin={instagramLogin}
                isDisabled={auth.isLoading}
              />
            </Col>
            <Col md="12">
              <SocialButton
                socialMedia="linkedin"
                socialMediaIcon="linkedin-in"
                label="Login with LinkedIn"
                handleSocialLogin={linkedinLogin}
                isDisabled={auth.isLoading}
              />
            </Col>
            <Col md="12">
              <SocialButton
                socialMedia="github"
                socialMediaIcon="github"
                label="Login with GitHub"
                handleSocialLogin={githubLogin}
                isDisabled={auth.isLoading}
              />
            </Col>
            <Col md="12">
              <Divider className="line" />
            </Col>
            <Col md="12">
              <RegisterButton
                link="/register"
                isDisabled={auth.isLoading}
              />
            </Col>
          </Row>
        </Panel>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
