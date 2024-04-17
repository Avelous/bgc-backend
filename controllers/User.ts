import Message from "../models/Message";
import { Request, Response } from "express";
import { ably } from "..";

const JWT_SECRET = process.env.JWT_SECRET || "hard to guess string";

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().lean();
    ably.channels.get("messages").publish("messages", messages);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const newMessage = async (req: Request, res: Response) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    const messages = await Message.find().lean();
    ably.channels.get("messages").publish("messages", messages);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
