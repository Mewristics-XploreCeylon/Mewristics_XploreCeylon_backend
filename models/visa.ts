import mongoose, { Schema, Document } from 'mongoose';

interface VisaStatusItem {
  status: string;
  updatedAt: Date;
  title: string;
  description: string;
}

interface IVisaStatus extends Document {
  visaApplication: mongoose.Types.ObjectId;
  statusList: VisaStatusItem[];
}

const VisaStatusSchema: Schema = new Schema({
  visaApplication: { type: Schema.Types.ObjectId, ref: 'VisaApplication', required: true },
  statusList: { type: [Object], required: true },
});

const VisaStatus = mongoose.model<IVisaStatus>('VisaStatus', VisaStatusSchema);

export default VisaStatus;
