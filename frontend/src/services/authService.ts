import {LoginResponse, RefreshTokenResponse, User} from "../types/authTypes.ts";
import {loginEndpoint, logoutEndpoint, registerEndpoint, RTVerificationEndpoint} from "../constants/authEndpoints.ts";

export async function frontendUserLogin(username: string, password: string): Promise<User | null> {
  try {
    const res: Response = await fetch(loginEndpoint, {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    if (res.ok) {
      const responseData: LoginResponse = await res.json()
      // const refreshToken = getCookieKeyFromBackend('refreshToken')
      const refreshToken: string = responseData.refreshToken
      const accessToken: string = responseData.accessToken

      localStorage.setItem('accessToken', accessToken)
      document.cookie = `refreshToken=${refreshToken};maxAge=1209600`
      // console.log(responseData.resUser)
      return responseData.resUser
    } else {
      const errorData = await res.json();
      alert(`Authentication failed: ${errorData.message}`)
      console.error(`Authentication failed: ${errorData.message}`);
    }

  } catch (e) {
    console.error("Unable to log in the user, error: ", e)
  }
  return null
}


export async function frontendUserRegister(username: string, email: string, password: string): Promise<boolean> {
  try {
    const res: Response = await fetch(registerEndpoint, {
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password
      })
    })

    if (res.status === 201) {
      const successData = await res.json()
      alert(successData.message)
      return true
    } else {
      const errorData = await res.json()
      alert(`Registration error: ${errorData.message}`)
      console.error(`Registration error: ${errorData.message}`)
      return false
    }

  } catch (e) {
    console.error("Error while registering the user, error:", e)
    return false
  }
}

export async function frontendUserLogout(): Promise<void> {
  // Since every httpOnly cookie is sent with every HTTP request, there is no need to send it manually
  try {
    const res: Response = await fetch(logoutEndpoint, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    if (res.ok) {
      // console.log("(85:7) - revoking the token was successful")
      localStorage.removeItem("accessToken")
      localStorage.removeItem("user")
      return
    } else {
      const errorData = await res.json()
      return console.error(`Logout error: ${errorData.message}`)
    }
  } catch (e) {
    return console.error("Unable to log out, error: ", e)
  }
}

export async function verifyUserRefreshToken(): Promise<{ userId: string; role: string } | boolean | undefined> {
  try {
    const res: Response = await fetch(RTVerificationEndpoint, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // credentials: "include"
    })
    if (res.ok) {
      const userData: RefreshTokenResponse = await res.json()
      // Since the res.status is 200 it will return resUser
      return userData.resUser!
    }
    if (res.status === 401) {
      return undefined
    }

  } catch (e) {
    console.error("Unable to verify the refreshToken due to API request to the backend")
    return false
  }
  return false
}

// const authService = {
//   frontendUserLogin,
//   frontendUserRegister,
//   frontendUserLogout
// }
//
// export default authService