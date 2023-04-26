import React, { 
  useContext,
  useState,
} from 'react';

import "./LoginWindow.scss";

// import { auth } from "../../firebase/firebase";

// import { 
//   signIn,
//   signUp,
// } from "../../firebase/auth";

import { UserContext } from '../../contexts/UserContext';

import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';

const LoginWindow = ({
  windowMode,
  setWindowMode,
}) => {
  const getContainerClassNames = () => `
    login-window-container
    ${windowMode !== "disabled" ? "active" : ""}
  `;

  const closeWindow = (event) => {
    if (event && event.target.closest(".login-window-wrapper")) {
      return;
    }

    setWindowMode("disabled");
  };

  return ( 
    <div 
      className={getContainerClassNames()}
      // TODO: Temporary way to close window - exclude .login-window-wrapper from this
      onClick={closeWindow}
    >
      <div className="login-window-wrapper">
        {
          windowMode === "signup" && (
            <SignUpForm 
              closeWindow={closeWindow}
            />
          )
        }

        {
          windowMode === "login" && (
            <LoginForm 
              closeWindow={closeWindow} 
            />
          )
        }
      </div>
    </div>
  );
}

function LoginForm ({ closeWindow }) {
  const PASSWORD_ERROR_STRING = "Incorrect password.";

  const [ email, setEmail ] = useState("");
  const [ loginPending, setLoginPending ] = useState(false);
  const [ password, setPassword ] = useState("");
  const [ passwordError, setPasswordError ] = useState();

  const { login } = useContext(UserContext);

  const canSubmit = email.length > 0 && password.length > 0 && !loginPending;

  const loginButtonType = loginPending ? "waiting" : "login";

  const hasPasswordError = 
    passwordError && typeof passwordError === 'string' && passwordError.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoginPending(true);
    
    const failureCallback = () => {
      setLoginPending(false);
      setPasswordError(PASSWORD_ERROR_STRING)
    };

    console.log("Firing LoginForm handleSubmit");
    const result = login(email, password, closeWindow, failureCallback);

    console.log("login result: ", result);

    // TODO: Only close on success
    // assuming success here
    // closeWindow();
  };
  
  return (
    <div className="login-form">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <TextInput
          label="email"
          setValue={setEmail}
          value={email}
        />

        <TextInput
          error={hasPasswordError}
          label="password"
          onChange={() => setPasswordError("")}
          password={true}
          setValue={setPassword}
          value={password}
        />

        {
          hasPasswordError && (
            <div className="auth-form-error">
              Incorrect password.
            </div>
          )
        }

        <Button
          className="login-button"
          disabled={!canSubmit}
          isFormSubmit
          onClick={handleSubmit}
          type={loginButtonType}
        >
          Login
        </Button>

      </form>
    </div>
  ); 
}

function SignUpForm ({ closeWindow }) {
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ username, setUsername ] = useState("");

  const { register } = useContext(UserContext);
  
  const passwordsMatch = password === confirmPassword;
  
  const passwordError = 
    password.length !== 0 && confirmPassword.length !== 0 && !passwordsMatch;
  
  const canSubmit = email.length > 0 && username.length > 0 && password.length > 0 &&
    confirmPassword.length > 0 && passwordsMatch; 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Firing SignupForm handleSubmit");
    register(email, password, username, closeWindow);
    // closeWindow();
  };

  return (
    <div className="login-form">
      <h1>Register</h1>

      <form 
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <TextInput
          label="username"
          setValue={setUsername}
          value={username}
        />

        <TextInput
          label="email"
          setValue={setEmail}
          value={email}
        />

        <TextInput
          error={passwordError}
          label="password"
          password={true}
          setValue={setPassword}
          value={password}
          />

        <TextInput
          error={passwordError}
          label="confirm password"
          password={true}
          value={confirmPassword}
          setValue={setConfirmPassword}
        />

        <Button
          className="login-button"
          disabled={!canSubmit}
          isFormSubmit
          onClick={handleSubmit}
          type="signup"
        >
          Signup
        </Button>
      </form>
    </div>
  ); 
}
 
export default LoginWindow;