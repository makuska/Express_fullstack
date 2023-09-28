// import jsonwebtoken from "jsonwebtoken";
// import {randomUUID} from "crypto";

export const accessTokenOptions = {
    algorithm: 'HS256',
    allowInsecureKeySizes: true,
    expiresIn: "2m",
}
export const refreshTokenOptions = {
    algorithm: 'HS256',
    allowInsecureKeySizes: true,
    expiresIn: "14d",
}
// const refreshTokenPayload = { id: user._id, role: user.role, token_id: randomUUID() }
//
// export function createrefreshToken() {
//     try {
//         jsonwebtoken.sign(
//
//         )
//     } catch (e) {
//
//     }
// }