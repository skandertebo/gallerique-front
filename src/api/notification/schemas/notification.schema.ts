import { GenericSchema } from "../../generic/generic.schema";

export interface NotificationSchema extends GenericSchema {
  title: string;
  content: string;
  createdAt: string;
}
