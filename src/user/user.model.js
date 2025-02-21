import {Schema, model} from "mongoose";

const userSchema = Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    gmail:{
        type: String,
        required: [true, "gmail is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Your Password is required"]
    },
    role:{
        type: String,
        required: true,
        enum: ["admin_role", "user_role"],
        default: "user_role"
    },

}, 
{
    versionKey: false,
    timestamps: true

}) 

userSchema.methods.toJSON = function(){
    const {password, _id, ...usuario} = this.toObject()
    usuario.uid = _id
    return usuario
}

export default model("User", userSchema)