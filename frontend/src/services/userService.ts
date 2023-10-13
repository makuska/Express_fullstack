import {User} from "../types/authTypes.ts";
import {getUSerDetailsByIdEndpoint} from "../constants/userEndpoints.ts";

export async function getUserDataById(userId: string): Promise<User | null> {
  try {
    const res: Response = await fetch(`${getUSerDetailsByIdEndpoint}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const userData: User = await res.json();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error while fetching user data by ID:', error);
    return null;
  }
}