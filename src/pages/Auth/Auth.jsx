import { useState } from "react";
import Panel from "../../components/Panel/Panel";
import Login from "./Login";
import { AUTH_STATE } from "../../utils/constants";
import Register from "./Register";
import Logo from "../../components/Logo/Logo";
import "./Auth.scss";

const { LOGIN, REGISTER } = AUTH_STATE;

const Auth = () => {
  const [formState, setFormState] = useState(LOGIN);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormState = () =>
    formState === LOGIN ? setFormState(REGISTER) : setFormState(LOGIN);

  const link = (text) => (
    <span id="link" className="no-select" onClick={handleFormState}>
      {text}
    </span>
  );

  const props = {
    isLoading,
    setIsLoading,
  };

  return (
    <>
      <Panel id="auth-form" size="lg" closable={false}>
        <Logo />
        {formState === LOGIN ? <Login {...props} /> : <Register {...props} />}
        {isLoading && (
          <div className="auth-loading-text">
            Our free server may take up to 45 seconds to wake up. Please wait
            while we log you in! 😊
          </div>
        )}
        {!isLoading &&
          (formState === LOGIN ? link("Sign up now") : link("Login"))}
      </Panel>
    </>
  );
};

export default Auth;
