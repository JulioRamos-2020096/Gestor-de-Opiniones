import { hash, verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

export const register = async (req, res) => {
    try {
        const data = req.body;
        const encryptedPassword = await hash(data.password);
        data.password = encryptedPassword;

        const user = await User.create(data);

        return res.status(201).json({
            message: "User has been created",
            name: user.name,
            email: user.email
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed",
            error: err.message
        });
    }
};

export const login = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (!user) {
            return res.status(400).json({
                message: "Credenciales inválidas",
                error: "No existe el usuario o correo ingresado"
            });
        }

        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                message: "Credenciales inválidas",
                error: "Contraseña incorrecta"
            });
        }

        const token = await generateJWT(user.id);

        return res.status(200).json({
            message: "Login successful",
            userDetails: {
                token: token
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Login failed, server error",
            error: err.message
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Se requieren la contraseña actual y la nueva contraseña."
            });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el usuario."
            });
        }

        const isPasswordValid = await verify(user.password, oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta."
            });
        }

        const isSamePassword = await verify(user.password, newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior."
            });
        }

        const encryptedPassword = await hash(newPassword);
        await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente."
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Hubo un error al actualizar la contraseña.",
            error: err.message
        });
    }
};
