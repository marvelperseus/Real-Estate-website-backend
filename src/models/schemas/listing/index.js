const mongoose = require('mongoose');
const User = require('../../User');
const CustomError = require('../../../utils/CustomError');
const moment = require('moment');
const { round } = require('../../../utils/Math');

const listingSchema = mongoose.Schema(
  {
    listingID: {
      type: String,
      required: true,
      index: { unique: true },
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
    },
    floors: {
      type: Number,
    },
    unitCount: {
      type: Number,
    },
    builtIn: {
      type: String,
    },
    approx: {
      type: String,
    },
    condoOwn: {
      minimumDownPayment: {
        type: String,
      },
      tax: {
        type: String,
      },
      maintenanceFee: {
        type: Number,
      },
    },
    cooperativeOwn: {
      maintenanceFee: {
        type: Number,
      },
    },
    amenities: {
      type: [String],
    },
    address: {
      type: String,
      required: true,
    },
    offer: {
      type: String,
      required: true,
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
    agentID: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    agentName: {
      type: String,
      required: true,
      trim: true,
    },
    featuredImage: {
      type: String,
    },
    images: {
      type: [String],
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
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
    coordinates: {
      type: [Number],
    },
    sqFootage: {
      type: Number,
    },
    moveInDate: {
      type: Date,
    },
    beds: {
      type: Number,
    },
    baths: {
      type: Number,
    },
    featured: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

async function findByListingID(listingID) {
  const listings = await this.findOne({ listingID }).exec();
  return listings;
}

async function findByAgentID(agentID) {
  const listings = await this.find({ agentID }).exec();
  return listings;
}

async function findByAgentName(agentName) {
  const listings = await this.find({ agentName }).exec();
  return listings;
}

listingSchema.static('findByAgentID', findByAgentID);

listingSchema.static('findByAgentName', findByAgentName);

listingSchema.static('findByListingID', findByListingID);

module.exports = listingSchema;
