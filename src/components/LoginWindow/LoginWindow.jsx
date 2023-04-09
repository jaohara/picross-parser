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

import { AuthContext } from '../../contexts/AuthContext';

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
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const { login } = useContext(AuthContext);

  const canSubmit = email.length > 0 && password.length > 0;

  const handleSubmit = () => {
    console.log("Firing LoginForm handleSubmit");
    login(email, password);

    // TODO: Only close on success
    // assuming success here
    closeWindow();
  };
  
  return (
    <div className="login-form">
      <h1>Login</h1>

      <TextInput
        label="email"
        setValue={setEmail}
        value={email}
      />

      <TextInput
        label="password"
        password={true}
        setValue={setPassword}
        value={password}
      />

      <Button
        className="login-button"
        disabled={!canSubmit}
        onClick={handleSubmit}
        type="login"
      >
        Login
      </Button>
    </div>
  ); 
}

function SignUpForm ({ closeWindow }) {
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ username, setUsername ] = useState("");

  const { register } = useContext(AuthContext);
  
  const passwordsMatch = password === confirmPassword;
  
  const passwordError = 
    password.length !== 0 && confirmPassword.length !== 0 && !passwordsMatch;
  
  const canSubmit = email.length > 0 && username.length > 0 && password.length > 0 &&
    confirmPassword.length > 0 && passwordsMatch; 

  const handleSubmit = () => {
    console.log("Firing SignupForm handleSubmit");
    register(email, password, username);

    // TODO: only close on register success
    // also assuming success here
    closeWindow();
  };

  return (
    <div className="login-form">
      <h1>Register</h1>

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
        onClick={handleSubmit}
        type="signup"
      >
        Signup
      </Button>
    </div>
  ); 
}
 
export default LoginWindow;