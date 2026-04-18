const mongoose = require('mongoose');

const DEFAULT_TABLES = [
  { number: '1', capacity: 2 },
  { number: '2', capacity: 4 },
  { number: '3', capacity: 2 },
  { number: '4', capacity: 6 },
  { number: '5', capacity: 4 },
  { number: '6', capacity: 8 },
  { number: '7', capacity: 2 },
  { number: '8', capacity: 4 },
];

const tableStatusSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    isAvailable: { type: Boolean, default: true },
    bookedBy: { type: String, trim: true, default: null },
    bookedPhone: { type: String, trim: true, default: null },
    bookedGuests: { type: Number, default: null },
    bookedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

tableStatusSchema.statics.ensureDefaults = async function ensureDefaults() {
  await Promise.all(
    DEFAULT_TABLES.map((table) =>
      this.updateOne(
        { number: table.number },
        { $setOnInsert: { ...table, isAvailable: true } },
        { upsert: true }
      )
    )
  );
};

module.exports = {
  TableStatus: mongoose.model('TableStatus', tableStatusSchema),
  DEFAULT_TABLES,
};
