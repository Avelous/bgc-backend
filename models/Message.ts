/* Mongoose Model */
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  channel: String,
  account: String,
  text: String,
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
