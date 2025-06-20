import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username: {
        type: String,
        reqired: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        reqired: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fillName: {
        type: String,
        reqired: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        reqired: true,
    },
    coverImage:{
        type: String // cloudinary url
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
    refreshToken: {
        type: String
    }

},{
    timestamps: true
})

userSchema.pre("save", async function (next) {
    // if(this.isModified("password")){
    //     this.password = bcrypt.hash(this.password, 10)
    //     next()
    // }

    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)    
}

userSchema.methods.genAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.genRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema) 