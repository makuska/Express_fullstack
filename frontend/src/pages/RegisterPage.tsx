import Header from "../components/Header";
import {useState} from "react";
import {NavigateFunction, useNavigate} from "react-router-dom";
import { getUsernameFromDatabase } from "../services/registerPageService.ts";
import { getEmailFromDatabase } from "../services/registerPageService.ts";

function RegisterPage() {
  const [username, setUsername] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmationPassword, setConfirmationPassword] = useState<string>("")
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  const [usernameError, setUsernameError] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [emailError, setEmailError] = useState<string>('')

  const navigate: NavigateFunction = useNavigate()
  const passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
  const usernameRegex: RegExp = /^\[A-z\][A-z0-9-_]{3,23}$/
  const emailRegex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  const handleAgreementChange = (event: any): void => {
    setAgreedToTerms(event.target.checked);
  };

  // useEffect(() => {
  //     const delayDebounceFn = setTimeout(() => {
  //         console.log(searchTerm)
  //         getUsernameFromDatabase().then(r => {
  //             if (r.toString() !== searchTerm) {
  //                 alert(`The username: ${searchTerm} already exists, please choose another`)
  //                 return 1
  //             }
  //         })
  //     }, 3000)
  //
  //     return () => clearTimeout(delayDebounceFn)
  // }, [searchTerm]);

  async function validateUsername(): Promise<void> {
    if (username.trim() === "") {
      setUsernameError("Username is required")
      return;
    }
    if (!usernameRegex.test(username)) {
      setUsernameError("Username must be at between 3-23 characters long and can only contain letters and numbers");
      return;
    }

    const usernameExists = await getUsernameFromDatabase(username)

    if (usernameExists) {
      setUsernameError("Username already exists, please choose another")
    } else {
      setUsernameError("")
    }
  }

  async function validateEmail(): Promise<void> {
    if (email.trim() === ""){
      setEmailError("Email is required")
      return;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Valid emails only!");
      return;
    }
    const emailExists = await getEmailFromDatabase(email)

    if (emailExists) {
      setEmailError("Email already exists, please choose another")
    } else {
      setEmailError("")
    }
  }

  async function validatePassword(): Promise<string | undefined> {
    setPasswordError("")
    if (password.trim() === ""){
      setPasswordError("Password is required")
      return;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError("Password must be strong: at least 8 characters, including upper and lower case letters, numbers, and special characters.");
      return;
    }
  }


  function onSignUpButtonClick(): void {
    if (!agreedToTerms) {
      alert("Please agree with the T&C first!")
      return
    }
    alert(`User ${username} successfully registered!`)
  }

  function navigateToLoginPage(): void {
    navigate("/login")
  }

  function validateConfirmationPassword(): string | undefined {
    if (confirmationPassword !== password) {
      return "The passwords must match, please type again!"
    }
  }

  return (
    <>
      <Header />
      <div className="login-container sign-up" style={{height: "700px"}}>
        <div className="title-container">
          <div>Sign Up!</div>
        </div>
        <br/>
        <div className="input-container register">
          <label className="input-labels-registration">Username</label>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            onBlur={validateUsername}
            value={username}
            className="input-box"/>
          <label className="error-label">{usernameError}</label>
        </div>
        <br/>
        <div className="input-container register">
          <label className="input-labels-registration">Email Address</label>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={validateEmail}
            value={email}
            className="input-box"/>
          <label className="error-label">{emailError}</label>
        </div>
        <br/>
        <div className="input-container register">
          <label className="input-labels-registration">Password</label>
          <input
            placeholder="password"
            value={password}
            type="password"
            onChange={e => setPassword(e.target.value)}
            onBlur={validatePassword}
            className="input-box"/>
          <label className="error-label">{passwordError}</label>
        </div>
        <br/>
        <div className="input-container register">
          <label className="input-labels-registration">Confirm password</label>
          <input
            placeholder="password"
            value={confirmationPassword}
            type="password"
            onChange={e => setConfirmationPassword(e.target.value)}
            onBlur={validateConfirmationPassword}
            className="input-box"/>
        </div>
        <br />
        <div className="input-container register">
          <label className="input-labels-registration">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={handleAgreementChange}
            />
            <span style={{margin: "0 8px"}}>I agree to the Terms and Conditions</span>
          </label>
        </div>
        <br />
        <div className="input-container">
          <input
            className="input-button"
            type="button"
            onClick={onSignUpButtonClick}
            value="Sign Up!" />
        </div>
        <hr style={{margin: "1rem 0"}}/>
        <div>
          <label className="input-labels-registration">
            Have account already? <span onClick={navigateToLoginPage} style={{cursor: "pointer", color: "#0056b3"}}>Log In</span>
          </label>
        </div>
      </div>
    </>
  )
}

export default RegisterPage;