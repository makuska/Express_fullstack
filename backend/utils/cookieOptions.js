const maxAgeInMilliseconds = 14 * 24 * 60 * 60 * 1000 //14days

export const cookieOptions = {
    httpOnly: true,
    // sameSite: 'strict', // Allow cross-site requests
    // secure: true, //Recommended for HTTPS
    maxAge: maxAgeInMilliseconds
}