import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jsonwebtoken from "jsonwebtoken"

const userSchema = new Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            index : true,
            lowercase : true,
            trim : true
         },
        fullName : {
            type : String,
            required : true, 
            index : true,
            trim : true 
         },
        email : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
         },
        avatar : {
            type : String,
            required : true,
         },
        coverImage : {
            type : String,
         },
        watchHistory : {
            type : Schema.Types.ObjectId,
            ref : "Video"
         },
         password : {
            type : String,
            required : [true,"Password is required"]
         },
         refreshToken : {
            type : String
         }
    },
    {timestamps : true})

userSchema.pre("save", async function(next){

   if(!this.IsModified("password")) return next()

   this.password = bcrypt.hash(this.password,10)
   next()
})

userSchema.methods.IsPasswordCorrect = async function (password) {
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
   return Jwt.sign(
      {
         _id : this._id,
         email : this.email,
         username : this.username,
         fullName : this.fullName
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn : process.env.ACCESS_tOKEN_EXPIRY
      }

   )
}
userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign(
      {
         _id : this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn : process.env.REFRESH_tOKEN_EXPIRY
      }

   )
}

export const User = mongoose.model("User",userSchema)