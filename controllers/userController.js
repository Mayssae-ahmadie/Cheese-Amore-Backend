const Users = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require('../extra/generateToken');
const { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } = require('firebase/auth');
const auth = getAuth();


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await Users.findOne({ email });
        if (!result) {
            res.status(400).json({
                success: false,
                message: `User with email ${email} not found`,
            });
        }

        const validatePwd = await bcrypt.compare(password, result.password);

        if (!validatePwd) {
            return res.status(400).json({
                success: false,
                message: `Wrong password`,
            });
        }

        await signInWithEmailAndPassword(auth, email, password);
        const currentUser = auth.currentUser;

        if (!currentUser) {
            return res.status(400).json({
                success: false,
                message: `No authenticated user found.`,
            });
        }

        if (!currentUser.emailVerified) {
            return res.status(400).json({
                success: false,
                message: `Email not verified. Please check your email for verification.`,
            });
        }


        res.status(200).json({
            success: true,
            message: `Login successfully`,
            data: {
                ...result._doc,
                token: generateToken(result._id, result.role)
            },
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Unable to login`,
            err: err.message,
        });
    }
};

const register = async (req, res) => {
    const {
        fullName,
        email,
        password,
        phoneNumber,
        city,
        fullAddress,
        role
    } = req.body;
    const hashpwd = await bcrypt.hash(password, 10);

    if (!fullName || !email || !password || !phoneNumber) {
        return res.status(401).json({
            message: "All fields are required"
        });
    }

    const duplicate = await Users.findOne({
        email
    });

    if (duplicate) {
        return res.status(409).json({
            message: `email ${email} already has an account `
        });
    }

    try {
        const newUser = new Users({
            fullName: {
                firstName: fullName.firstName,
                lastName: fullName.lastName,
            },
            email,
            password: hashpwd,
            phoneNumber,
            city,
            fullAddress: {
                street: fullAddress.street,
                building: fullAddress.building,
                floor: fullAddress.floor,
                description: fullAddress.description,
            },
            role: role || "client",
        });

        await newUser.save();

        const firebaseUser = await createUserWithEmailAndPassword(auth, newUser.email, password);

        newUser.firebaseUid = firebaseUser.user.uid;
        await newUser.save();

        await sendEmailVerification(auth.currentUser);

        res.status(200).json({
            success: true,
            message: 'User added successfully. Please check your email for verification.',
            // token: generateToken(newUser._id, newUser.role),
            data: newUser,
        });
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            return res.status(409).json({
                success: false,
                message: `Email ${newUser.email} is already in use. Please log in or recover your account.`,
            });
        }

        res.status(400).json({
            success: false,
            message: 'Error while trying to register a new user.',
            error: error.message,
        });
    }
};

const getByID = async (req, res) => {
    const ID = req.params.ID;
    try {
        const result = await Users.findById(ID);
        if (!result) {
            return res.status(404).json({
                success: false,
                message: ` User not found ${ID} `,
                err: err.message,
            });
        }
        res.status(200).json({
            success: true,
            message: `User by id ${ID} retrieved succesfully`,
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Unable to get data by id ${ID} `,
            err: err.message,
        });
    }
};

const getAll = async (req, res) => {
    try {
        const result = await Users.find({});
        if (!Array.isArray(result))
            return res.status(400).json({
                success: false,
                message: `No data found`,
                data: result,
            });
        res.status(200).json({
            success: true,
            message: `Users retrieved succesfully`,
            data: result,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Unable to get all users`,
            err: err.message,
        });
    }
};

const deleteById = async (req, res) => {
    const ID = req.params.ID;
    try {
        const result = await Users.deleteOne({ _id: ID });
        res.status(200).json({
            success: true,
            message: `User with id ${ID} deleted successfully`,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Unable to delete user ${ID}`,
            err: err.message,
        });
    }
};

const update = async (req, res) => {
    const ID = req.params.ID;

    try {
        const { fullName, ...updateData } = req.body;

        if (fullName) {
            updateData.fullName = {
                firstName: fullName.split(" ")[0],
                lastName: fullName.split(" ")[1],
            };
        }

        const result = await Users.findByIdAndUpdate(ID, updateData);

        res.status(200).json({
            success: true,
            message: `User with id ${ID} updated successfully`,
            data: result,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: `Unable to update id ${ID}`,
            err: err.message,
        });
    }
};

const switchToAdmin = async (req, res) => {
    const ID = req.params.ID;

    try {
        const result = await Users.findById(ID);
        if (!result) {
            return res.status(400).json({
                success: false,
                message: `User with ${ID} not found.`,
            });
        }

        if (result.role === "admin") {
            return res.status(400).json({
                success: false,
                message: `User with ${ID} is already an admin.`,
            });
        }

        result.role = "admin";
        await result.save();

        return res.status(200).json({
            success: true,
            message: `User with ${ID} switched to admin successfully.`,
            data: user,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: `Error while trying to update user with ${ID}.`,
            error: error.message,
        });
    }
};

module.exports = { register, getByID, getAll, deleteById, update, login, switchToAdmin };