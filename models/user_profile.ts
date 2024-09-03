import mongoose, { Schema, Document } from 'mongoose';

interface IUserProfile extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  profilePicture: string;
}

const UserProfileSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  profilePicture: { type: String, required: false },
});

const UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfile;
