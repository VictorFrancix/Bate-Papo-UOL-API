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
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.any().valid('message', 'private_message').required(),});

const userSchema = joi.object({name: joi.string().required(),
});

app.post("/participants", async (req, res) => {
    

    if (participantSchema.validate(req.body).error) {
        console.log(participantSchema.validate(req.body).error.details);
        res.sendStatus(422);
        return;
    }
    let { name } = req.body;

    name = stripHtml(name).result;

    await mongoClient.connect();

    let user = await db.collection("users").findOne({ name: name });
    if (user) {
        res.sendStatus(409);
        return;
    }

    participante = {
        name,
        lastStatus: Date.now(),
    };

    try {
        await db.collection("participants").insertOne(participante);

        const sms = {
            from: name,
            to: "Todos",
            text: "entra na sala...",
            type: "status",
            time: dayjs().format("HH:mm:ss"),
        };

        await db.collection("mensagens").insertOne(sms);

        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
    }
});
app.get("/participants", async (req, res) => {
    try {
        const participants = await db.collection("participants").find().toArray();
        res.send(participants);
    } catch (err) {
        res.sendStatus(500);
    }
});


app.listen(5000, () =>
    console.log(chalk.blue("Server listening on port 5000")));