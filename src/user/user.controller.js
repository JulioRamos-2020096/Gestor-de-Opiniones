import { hash, verify } from "argon2";
import User from "./user.model.js";

export const updateUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;

        const updatedUser = await User.findByIdAndUpdate(uid, data, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el usuario para actualizar.",
            });
        }

        res.status(200).json({
            success: true, 
            message: "Usuario actualizado correctamente.",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar usuario.",
            error: error.message,
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Se requieren la contraseña actual y la nueva contraseña.",
            });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el usuario.",
            });
        }

        const isPasswordValid = await verify(user.password, oldPassword);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta.",
            });
        }

        const isSamePassword = await verify(user.password, newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior.",
            });
        }

        const encryptedPassword = await hash(newPassword);
        const updatedUser = await User.findByIdAndUpdate(
            uid,
            { password: encryptedPassword },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente.",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Hubo un error al actualizar la contraseña.",
            error: err.message,
        });
    }
};

export const createAdmin = async () => {
    try {
        const gmail = "adminunico@gmail.com";
        const password = "admin";

        const existingAdmin = await User.findOne({ email: gmail });

        if (!existingAdmin) {
            const encryptedPassword = await hash(password);

            const aUser = new User({
                name: "UnicoAdmin",
                surname: "Admin",
                username: "adminprimero",
                email: gmail,
                phone: "58701839",
                password: encryptedPassword,
                role: "ADMIN_ROLE",
            });

            await aUser.save();
            console.log("El unico admin se ha creado correctamente");
        } else {
            console.log("Ya existe un admin en la base de datos");
        }
    } catch (err) {
        console.error("Error al crear el unico admin", err);
    }
};