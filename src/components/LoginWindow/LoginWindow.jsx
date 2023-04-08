import React, { 
  useState 
} from 'react';

import "./LoginWindow.scss";

import { auth } from "../../firebase/firebase";

import { 
  signIn,
  signUp,
} from "../../firebase/auth";

import Button from '../Button/Button';
import TextInput from '../TextInput/TextInput';

const LoginWindow = ({
  windowActive,
  setWindowActive,
}) => {
  const [ showSignup, setShowSignup ] = useState(false);

  const getContainerClassNames = () => `
    login-window-container
    ${windowActive ? "active" : ""}
  `;

  const closeWindow = (event) => {
    if (event.target.closest(".login-window-wrapper")) {
      return;
    }

    setWindowActive(false);
  };

  const handleToggleForm = () => setShowSignup(!showSignup);

  return ( 
    <div 
      className={getContainerClassNames()}
      // TODO: Temporary way to close window - exclude .login-window-wrapper from this
      onClick={closeWindow}
    >
      <div className="login-window-wrapper"
        // onClick={e => e.preventDefault()}
      >
        <Button
          onClick={handleToggleForm}
          type={showSignup ? "login" : "signup"}
        >
          Toggle { showSignup ? "Login" : "Signup"}
        </Button>

        {
          showSignup ? (
            <SignUpForm />
          ) :
          (
            <LoginForm />
          )
        }

      </div>
    </div>
  );
}

function LoginForm () {
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  const handleSubmit = () => {
    console.log("Firing LoginForm handleSubmit");
    // TODO: Implement
    signIn(email, password);
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
        onClick={handleSubmit}
        type="login"
      >
        Login
      </Button>
    </div>
  ); 
}

function SignUpForm () {
  const [ confirmPassword, setConfirmPassword ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ username, setUsername ] = useState("");
  
  const passwordsMatch = password === confirmPassword;
  
  const passwordError = 
  password.length !== 0 && confirmPassword.length !== 0 && !passwordsMatch;
  
  const handleSubmit = () => {
    console.log("Firing SignupForm handleSubmit");
    // TODO: Implement
    signUp(email, password, username);
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
        onClick={handleSubmit}
        type="signup"
      >
        Signup
      </Button>
    </div>
  ); 
}
 
export default LoginWindow;