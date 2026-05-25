import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
   username: string;
   email: string;
   password?: string;
   fullName: string;
   createdAt: Date;
}

const UserSchema: Schema = new Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
      },
      fullName: {
         type: String,
         required: true,
         trim: true,
      },
   },
   {
      timestamps: { createdAt: "createdAt", updatedAt: false },
   }
);

// Remove password before turning model into JSON
UserSchema.set("toJSON", {
   transform: (_doc, ret) => {
      delete ret.password;
      return ret;
   },
});

export default mongoose.model<IUser>("User", UserSchema);
