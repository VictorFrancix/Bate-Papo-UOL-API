import express, {json} from 'express';
import chalk from 'chalk';
import cors from 'cors';
import {MongoClient} from 'mongodb';
import dotenv from 'dotenv';
import {stripHtml} from 'string-strip-Html';
import dayjs from 'dayjs';
import joi from 'joi';

dotenv.config();
const app = express();

app.use(json());
app.use(cors());

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;
mongoClient.connect(() => {
  db = mongoClient.db("batepapo-uol");
});

const msgSchema = joi.object({
    to: joi.string().required().trim(),
    text: joi.string().required().trim(),
    type: joi.any().valid('message', 'private_message').required(),});

const userSchema = joi.object({name: joi.string().required().trim(),
});

