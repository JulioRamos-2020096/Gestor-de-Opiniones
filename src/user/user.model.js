import {Schema, model} from "mongoose";

const userSchema = Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Your Password is required"]
    },
    role:{
        type: String,
        required: true,
        enum: ["ADMIN_ROLE", "USER_ROLE"],
        default: "USER_ROLE"
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