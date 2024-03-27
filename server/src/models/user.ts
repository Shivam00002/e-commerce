import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  otp?: string;
  interest:string[];
}

const UserSchema: Schema<UserDocument> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  interest: [{ type:String }]
});

const User = mongoose.model<UserDocument>("User", UserSchema);

export default User;