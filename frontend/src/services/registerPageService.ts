const endpoint: string = 'api/v1/users'

export async function getUsernameFromDatabase(username: string) {
  console.log('api request')
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
      'cors': 'no-cors'
    },
    body: username
  }

  try {
    const response: Response = await fetch(endpoint, requestOptions)

    if (!response.ok) {
      // @ts-ignore
      const error = (response && response.message) || response.status
      return Promise.reject(error)
    }

    return response
  } catch (error) {
    const errorMessage: string = `An error occurred while getting the username ${username} details`;
    console.error(errorMessage)
    throw errorMessage
  }
}

export async function getEmailFromDatabase(email: string) {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'text/plain',
      'cors': 'no-cors'
    },
    body: email
  }

  try {
    const response: Response = await fetch(endpoint, requestOptions)

    if (!response.ok) {
      // @ts-ignore
      const error = (response && response.message) || response.status
      return Promise.reject(error)
    }

    return response
  } catch (error) {
    const errorMessage: string = `An error occurred while getting the username ${email} details`;
    console.error(errorMessage)
    throw errorMessage
  }
}