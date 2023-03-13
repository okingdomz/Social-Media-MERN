import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import User from "../models/User.js";


//  register user\
// calling to mongoose database

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            friends,
            email,
            picturePath,
            location,
            occupation,
            password
        } = req.body;
        // encrypt password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User ({
            firstName,
            lastName,
            friends,
            email,
            picturePath,
            location,
            occupation,
            password: passwordHash,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)

        });
        const savedUser = await newUser.save();
        // status 201, means something has been created
        res.status(201).JSON(savedUser);
    } catch (err) {
        res.status(500).JSON({ error: err.message });
    }

};

// logging in

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User doesn't exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).JSON({ msg: "Invalid password gang" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).JSON({ token, user });
    } catch (err) {
        res.status(500).JSON({ error: err.message });
    }
};