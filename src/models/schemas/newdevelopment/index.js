const mongoose = require('mongoose');

const newdevelopmentSchema = mongoose.Schema(
  {
    newdevelopmentID: {
      type: String,
      required: true,
      index: { unique: true },
    },
    name: {
      type: String,
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    subheadline: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    ownership: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    petPolicy: {
      type: String,
      required: true,
    },
    floors: {
      type: Number,
      required: true,
    },
    unitCount: {
      type: Number,
      required: true,
    },
    builderimage: {
      type: String,
    },
    coordinates: {
      type: [Number],
    },
    address: {
      type: String,
      required: true,
    },
    builderlogos: {
      type: [String],
    },
    region: {
      type: String,
      required: true,
    },
    neighborhood: {
      type: String,
      required: true,
    },
    borough: {
      type: String,
      required: true,
    },
    agents: {
      type: [String],
    },
    createdBy: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
    updatedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

async function findByNewdevelopmentID(newdevelopmentID) {
  const newdevelopment = await this.findOne({ newdevelopmentID }).exec();
  return newdevelopment;
}

newdevelopmentSchema.static('findByNewdevelopmentID', findByNewdevelopmentID);

module.exports = newdevelopmentSchema;
