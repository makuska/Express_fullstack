import {useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";
import Header from "../components/Header";

function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const navigate: NavigateFunction = useNavigate();

  const onButtonClick = (): undefined | number => {
    // Set initial error values to empty
    setEmailError("")
    setPasswordError("")

    if ("" === email) {
      setEmailError("Please enter your email")
      return
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email")
      return
    }
    if ("" === password) {
      setPasswordError("Please enter a password")
      return
    }
    if (password.length < 7) {
      setPasswordError("The password must be 8 characters or longer")
      return 1
    }

    // Authentication calls will be made here...

  }

  function navigateToRegisterPage(): void {
    navigate("/register")
  }

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="title-container">
          <div>Login</div>
        </div>
        <br />
        <div className="input-container">
          <input
            value={email}
            placeholder="Enter your email here"
            onChange={e => setEmail(e.target.value)}
            className="input-box" />
          <label className="error-label">{emailError}</label>
        </div>
        <br />
        {/* TODO USERNAME INPUT FIELD */}
        <div className="input-container">
          <input
            value={password}
            placeholder="Enter your password here"
            onChange={e => setPassword(e.target.value)}
            className="input-box" />
          <label className="error-label">{passwordError}</label>
        </div>
        <br />
        <div className="input-container">
          <input
            className="input-button"
            type="button"
            onClick={onButtonClick}
            value={"Log in"} />
        </div>
        <br/>
        <div className="input-container">
          <input
            className="registration-button"
            type="button"
            onClick={navigateToRegisterPage}
            value="Register"
          />
        </div>
      </div>
    </>
  )
}

export default LoginPage;