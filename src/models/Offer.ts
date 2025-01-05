import { Schema, models, model } from 'mongoose';

const common = {
  type: String,
  required: true,
  trim: true,
};

const optional = {
  type: String,
  required: false,
  trim: true,
};

const offerSchema = new Schema(
  {
    source: common,
    title: common,
    isSoldout: {
      type: Boolean,
      required: false,
      trim: true,
    },
    published: {
      type: String,
      required: false,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    checked: {
      type: Boolean,
      required: true,
      trim: true,
    },
    merchant: {
      type: String,
      required: false,
      trim: true,
    },
    price: {
      type: String,
      required: false,
      trim: true,
    },
    type: optional,
    dates: {
      type: String,
      required: false,
      trim: true,
    },
    flight: {
      type: String,
      required: false,
      trim: true,
    },
    from: optional,
  },
  {
    timestamps: true,
  }
);

const Offer = models.Offer || model('Offer', offerSchema);

export default Offer;
