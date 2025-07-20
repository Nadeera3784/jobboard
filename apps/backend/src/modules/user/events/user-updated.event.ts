import { ObjectId } from "mongoose";

export class UserUpdatedEvent {
  id: ObjectId;
  type: string;
}
