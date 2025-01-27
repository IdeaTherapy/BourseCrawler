import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "@/consts";

export const botClient = new Telegraf(BOT_TOKEN);

botClient.launch();

// Enable graceful stop
process.once("SIGINT", () => botClient.stop("SIGINT"));
process.once("SIGTERM", () => botClient.stop("SIGTERM"));
