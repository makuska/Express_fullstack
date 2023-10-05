import {useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";
import Header from "../components/Header";
import {useAuth} from "../hooks/useAuth.ts";

function LoginPage() {
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [usernameError, setUsernameError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")

  const navigate: NavigateFunction = useNavigate();
  const {login} = useAuth()

  const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
  const usernameRegex: RegExp = /^[A-Za-z0-9]{3,23}$/

  function navigateToRegisterPage(): void {
    navigate("/register")
  }

  function validateUsername() {
    setUsernameError("")
    if ("" === username) {
      setUsernameError("Please enter your username")
      return
    }
    if (!usernameRegex.test(username)) {
      setUsernameError("Usernames are at least 3 characters long, don't you remember?!")
      return
    }
  }

  function validatePassword(): void {
    setPasswordError("")

    if ("" === password) {
      setPasswordError("Please enter a password")
      return
    }
    if (!passwordRegex.test(password)) {
      setPasswordError("The password must be 8 characters or longer")
      return
    }
  }

  async function onLoginButtonClick(): Promise<void> {
    if (!username || !password) {
      alert('Please fill in all required fields.')
      return
    }
    // Check for validation errors
    if (usernameError || passwordError) {
      alert('Please fix the validation errors before signing up.')
      return
    }

    // frontendUserLogin(username, password)
    await login(username, password)
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
            value={username}
            placeholder="Enter your username here"
            onChange={e => setUsername(e.target.value)}
            onBlur={validateUsername}
            className="input-box" />
          <label className="error-label">{usernameError}</label>
        </div>
        <br />
        <div className="input-container">
          <input
            value={password}
            type="password"
            placeholder="Enter your password here"
            onChange={e => setPassword(e.target.value)}
            onBlur={validatePassword}
            className="input-box" />
          <label className="error-label">{passwordError}</label>
        </div>
        <br />
        <div className="input-container">
          <input
            className="input-button"
            type="button"
            onClick={onLoginButtonClick}
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