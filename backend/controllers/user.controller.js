import {getUserById} from "../repository/userRepository.js";

export async function getUserDetailsById(req, res) {
    const { userId } = req.params
    if (!userId) return res.status(404).send({ message: "No userId provided!" })

    try {
        const user = await getUserById(userId)

        if (user) {
            const formattedUSer = {
                username: user.username,
                email: user.email,
                role: user.role,
                userId: user._id
            }
            return res.status(200).send(formattedUSer)
        } else {
            return res.status(404).send({ message: 'User not found' })
        }
    } catch (e) {
        console.error('Error while fetching user data by ID:', e);
        return res.status(500).json({ message: 'Internal server error' });
    }
}