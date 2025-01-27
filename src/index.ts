import { CronJob } from "cron";
import { ARZEH_AVALIEH_KEYWORDS, CRAWL_URL, DB_FILE_NAME } from "@/consts";
import { News } from "@/types";
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { newsTable } from "@/db/schema";
import { botClient } from "@/bot";
import { CHAT_ID } from "@/consts";
const db = drizzle(DB_FILE_NAME);

interface CrawlResponse {
  msg: News[];
}
const crawl = async (): Promise<CrawlResponse> => {
  const response = await fetch(CRAWL_URL);
  const data: CrawlResponse = await response.json();
  return data;
};

const saveNews = async (news: News[]): Promise<News[]> => {
  console.log(news.length);
  if (!news.length) return [];
  // Prepare the batch insert data
  const values = news.map((item) => ({
    ...item,
    createdAt: Date.now(),
  }));

  // Use an insert with ON CONFLICT DO NOTHING and return only the successfully inserted records
  const result = await db
    .insert(newsTable)
    .values(values)
    .onConflictDoNothing({ target: newsTable.tseMsgIdn })
    .returning({
      id: newsTable.id,
      tseMsgIdn: newsTable.tseMsgIdn,
      dEven: newsTable.dEven,
      hEven: newsTable.hEven,
      tseTitle: newsTable.tseTitle,
      tseDesc: newsTable.tseDesc,
      flow: newsTable.flow,
    });

  return result;
};

// Run every 1 second
const job = new CronJob("* * * * * *", async () => {
  try {
    console.log("Crawling news...");
    const data = await crawl();
    console.log("Saving news...");
    const savedNews = await saveNews(data.msg);
    if (savedNews.length > 0) {
      console.log(`Saved ${savedNews.length} new news items`);
      await botClient.telegram.sendMessage(
        CHAT_ID,
        `Saved ${savedNews.length} new news items`
      );
      const arzehAvalieh = savedNews.filter((item) =>
        ARZEH_AVALIEH_KEYWORDS.some((keyword) => item.tseDesc.includes(keyword))
      );
      arzehAvalieh.forEach((item) => {
        botClient.telegram.sendMessage(CHAT_ID, item.tseDesc);
      });
    } else {
      console.log("No new news items to save");
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

job.start();
