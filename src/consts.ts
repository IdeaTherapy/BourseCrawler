import * as dotenv from "dotenv";

dotenv.config();

export const PAGE_SIZE: string = process.env.PAGE_SIZE!;
export const CRAWL_URL: string = `${process.env.CRAWL_URL}/${PAGE_SIZE}`;
export const DB_FILE_NAME: string = process.env.DB_FILE_NAME!;
export const BOT_TOKEN: string = process.env.BOT_TOKEN!;
export const CHAT_ID: string = process.env.CHAT_ID!;
export const ARZEH_AVALIEH_KEYWORDS: string[] = [
  "عرضه",
  "عرضه گردد",
  "عرضه شود",
];
