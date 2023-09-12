import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModal from "../modals/user.js"

const secret = "test";

// login 
export const signin = async (req, res) => {
    const { email, password } = req.body
    try{
    const oldUser = await UserModal.findOne({ email })
    if (!oldUser) return res.status(404).json({ message: "User doesn't exist " })

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" })

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" })

    res.status(200).json({ result: oldUser, token })
}
catch (error) {
    res.status(500).json({ message: "Somthing went wrong" })
    console.log(error)
}
}

// signin 
export const signup = async (req, res) => {
    const { email, password, firstname, lastname } = req.body;
    try {

        const oldUser = await UserModal.findOne({ email })
        // check user 
        if (oldUser) {
            return res.status(400).json({ message: "User already registerd " })
        }

        //  secure password 
        const hashedPassword = await bcrypt.hash(password, 12)

        //  result 
        const result = await UserModal.create({
            email,
            password: hashedPassword,
            name: `${firstname} ${lastname}`
        });
        const token = jwt.sign({ email, id: result._id }, secret, { expiresIn: "1h" })

        res.status(201).json({ result, token })

    } catch (error) {
        res.status(500).json({ message: "Somthing went wrong" })
        console.log(error)
    }

}