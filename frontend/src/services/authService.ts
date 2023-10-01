export function frontendUserLogin(username: string, password: string) {
  try {
    fetch(`http://localhost:8080/api/auth/signin`, {
      method: 'POST',
      headers: {"content-Type": "application/json"},
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then(res => {
      if (res.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(res.data))
      }
    })

  } catch (e) {
    
  }
}