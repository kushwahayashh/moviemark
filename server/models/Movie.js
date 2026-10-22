import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true, unique: true, min: 1 },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    year: { type: String, default: "", trim: true, maxlength: 4 },
    posterPath: { type: String, default: null },
    backdropPath: { type: String, default: null },
    rating: {
      type: Number,
      default: null,
      validate: {
        validator: (value) =>
          value === null || (Number.isInteger(value) && value >= 1 && value <= 10),
        message: "Rating must be a whole number between 1 and 10",
      },
    },
    note: { type: String, default: "", trim: true, maxlength: 1000 },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model("Movie", movieSchema);
