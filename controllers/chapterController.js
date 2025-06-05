import Chapter from "../models/Chapter.js";
import fs from "fs";
import redis from "redis";

const client = redis.createClient({ url: process.env.REDIS_URL });
client.connect();

export const uploadChapters = async (req, res) => {
  const data = JSON.parse(fs.readFileSync(req.file.path));
  const failed = [];

  console.log("data", data);

  for (let item of data) {
    const chapterObj = {
      name: item.chapter,
      class: item.class,
      unit: item.unit,
      subject: item.subject,
      status: item.status,
      weakChapter: item.isWeakChapter,
      questionSolved: item.questionSolved || 0,
      yearWiseQuestionCount: item.yearWiseQuestionCount || {},
    };

    try {
      await Chapter.create(chapterObj);
    } catch (err) {
      failed.push({ chapter: chapterObj.name, error: err.message });
    }
  }
  await client.del("chapters_cache");
  res.json({ message: "Upload complete", failed });
};

export const getChapters = async (req, res) => {
  const queryParams = req.query;
  const cacheKey = `chapters_cache_${JSON.stringify(queryParams)}`;

  const cached = await client.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const query = {};
  if (req.query.class) query.class = req.query.class;
  if (req.query.unit) query.unit = req.query.unit;
  if (req.query.subject) query.subject = req.query.subject;
  if (req.query.status) query.status = req.query.status;
  if (req.query.weakChapters === "true") query.weakChapter = true;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const data = await Chapter.find(query).skip(skip).limit(limit);
  const total = await Chapter.countDocuments(query);

  const result = { total, page, limit, data };
  await client.setEx(cacheKey, 3600, JSON.stringify(result));

  res.json(result);
};

export const getChaptersById = async (req, res) => {
  const { id } = req.params;
  const chapter = await Chapter.findById(id);

  if (!chapter) return res.status(404).json({ error: "Not found" });
  res.json(chapter);
};
