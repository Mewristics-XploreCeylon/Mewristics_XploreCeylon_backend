import mongoose, { Schema, Document } from 'mongoose';

interface IVisaApplication extends Document {
  user: mongoose.Types.ObjectId;
  nationality: string;
  gender: string;
  placeOfBirth: string;
  currentAddress: string;
  mobileNumber: string;
  emailAddress: string;
  profession: string;
  employerAddress: string;
  passportImage: string;
  passportNumber: string;
  placeOfIssue: string;
  dateOfIssue: Date;
  dateOfExpiry: Date;
  prevPassportNumber: string;
  prevPlaceOfIssue: string;
  prevDateOfIssue: Date;
  prevDateOfExpiry: Date;
  emergencyContactName: string;
  emergencyContactAddress: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactOpName: string;
  emergencyContactOpAddress: string;
  emergencyContactOpPhone: string;
  emergencyContactOpRelationship: string;
  visaObjective: string;
  routeAndMode: string;
  addressStay: string;
  periodOfStay: string;
  rejectedPermission: string;
  money: number;
  cardName: string;
  fingerprint: string;
}

const VisaApplicationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  nationality: { type: String, required: false },
  gender: { type: String, required: false },
  placeOfBirth: { type: String, required: false },
  currentAddress: { type: String, required: false },
  mobileNumber: { type: String, required: false },
  emailAddress: { type: String, required: false },
  profession: { type: String, required: false },
  employerAddress: { type: String, required: false },
  passportImage: { type: String, required: false },
  passportNumber: { type: String, required: false },
  placeOfIssue: { type: String, required: false },
  dateOfIssue: { type: Date, required: false },
  dateOfExpiry: { type: Date, required: false },
  prevPassportNumber: { type: String, required: false },
  prevPlaceOfIssue: { type: String, required: false },
  prevDateOfIssue: { type: Date, required: false },
  prevDateOfExpiry: { type: Date, required: false },
  emergencyContactName: { type: String, required: false },
  emergencyContactAddress: { type: String, required: false },
  emergencyContactPhone: { type: String, required: false },
  emergencyContactRelationship: { type: String, required: false },
  emergencyContactOpName: { type: String, required: false },
  emergencyContactOpAddress: { type: String, required: false },
  emergencyContactOpPhone: { type: String, required: false },
  emergencyContactOpRelationship: { type: String, required: false },
  visaObjective: { type: String, required: false },
  routeAndMode: { type: String, required: false },
  addressStay: { type: String, required: false },
  periodOfStay: { type: String, required: false },
  rejectedPermission: { type: String, required: false },
  money: { type: Number, required: false },
  cardName: { type: String, required: false },
  fingerprint: { type: String, required: false },
})

const VisaApplication = mongoose.model<IVisaApplication>('VisaApplication', VisaApplicationSchema);

export default VisaApplication;
