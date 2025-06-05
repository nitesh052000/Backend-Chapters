import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  unit: { type: String, required: true },
  subject: { type: String, required: true },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    required: true,
  },
  weakChapter: { type: Boolean, default: false },
  questionSolved: { type: Number, default: 0 },
  yearWiseQuestionCount: { type: Object },
});

export default mongoose.model("Chapter", chapterSchema);
