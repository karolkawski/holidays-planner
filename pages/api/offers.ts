import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

function getDateFromFileName(fileName: string): string {
  const datePart = fileName.split("_")[1].split(".")[0]; // '2024-11-02T16:54:36.191Z'
  return datePart.split("T")[0]; // '2024-11-02'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(req);

  try {
    const offersDir = path.join(process.cwd(), "public", "output", "offers");
    const screenshotsDir = path.join(
      process.cwd(),
      "public",
      "output",
      "screenshots"
    );

    const offersFiles = await fs.promises.readdir(offersDir);

    const screenshotsFiles = await fs.promises.readdir(screenshotsDir);

    const files = {
      offers: [],
      screenshots: []
    }
    if (offersFiles.length > 0) {
      const filesByDate: Record<string, { date: string; offers: any }> = {};

      await Promise.all(
        offersFiles.map(async (name) => {
          const date = getDateFromFileName(name);

          if (date) {
            const offerPath = path.join(offersDir, name);
            const offerContent = await fs.promises.readFile(offerPath, "utf8");
            const data = JSON.parse(offerContent);

    
            if (
              !filesByDate[date] ||
              new Date(data.date) > new Date(filesByDate[date].date)
            ) {
              filesByDate[date] = [...data.offers];
              files.offers.push(name);
            }
          }
        })
      );

      return res.status(200).json({
        files: {
          offers: files.offers,
          screenshots: screenshotsFiles,
        },
        offers: filesByDate,
      });
    } else {
      return res.status(200).json({
        files: {
          offers: [],
          screenshots: screenshotsFiles,
        },
        offers: [],
      });
    }
  } catch (error) {
    console.error("Getting offers failed:", error);
    return res.status(500).json({ error: "Getting offers failed" });
  }
}
