import {ILoginResponse} from "../types/authTypes.ts";

export async function frontendUserLogin(username: string, password: string) {
  try {
    const res: Response = await fetch(`http://localhost:8080/api/auth/signin`, {
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
      const responseData: ILoginResponse = await res.json()
      // const refreshToken = getCookieKeyFromBackend('refreshToken')
      const refreshToken: string = responseData.refreshToken
      const accessToken: string = responseData.accessToken

      localStorage.setItem('accessToken', accessToken)
      document.cookie = `refreshToken=${refreshToken};maxAge=1209600`

    } else {
      console.error("Authentication failed!")
    }

  } catch (e) {
    console.error("Unable to log in the user, error: ", e)
  }
}