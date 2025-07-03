const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ratings: {
    coffee: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    atmosphere: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    }
  },
  address: {
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    }
  }
}, { timestamps: true });

const Cafe = mongoose.models.Cafe || mongoose.model('Cafe', cafeSchema);

export default Cafe;
