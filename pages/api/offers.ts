import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { IOffer } from "@/types/IOffer";

function getDateFromFileName(fileName: string): string {
  const datePart = fileName.split("_")[1].split(".")[0];
  return datePart.split("T")[0];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date } = req.query;

  try {
    const offersDir = path.join(process.cwd(), "public", "output", "offers");
    const screenshotsDir = path.join(
      process.cwd(),
      "public",
      "output",
      "screenshots"
    );

    const offersFiles: string[] = await fs.promises.readdir(offersDir);

    const screenshotsFiles = await fs.promises.readdir(screenshotsDir);

    const files: {offers: string[], screenshots: string[]} = {
      offers: [],
      screenshots: [],
    };
    if (offersFiles.length > 0) {
      const filesByDate: Record<string, IOffer[]> = {};
      const offersByDate: Record<string, any[]> = {};

      await Promise.all(
        offersFiles.map(async (name) => {
          const fileDate = getDateFromFileName(name);

          if (fileDate) {
            if (!date || new Date(fileDate) >= new Date(date as string)) {
              const offerPath = path.join(offersDir, name);
              const offerContent = await fs.promises.readFile(
                offerPath,
                "utf8"
              );
              const data = JSON.parse(offerContent);

              offersByDate[fileDate] = offersByDate[fileDate] || [];
              if (data.offers) {
                offersByDate[fileDate].push(...data.offers);
              }

              filesByDate[fileDate] = offersByDate[fileDate];
              files.offers.push(name);
            }
          }
        })
      );

      // Sort filesByDate by date (newest to oldest)
      const sortedFilesByDate = Object.keys(filesByDate)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .reduce<Record<string, IOffer[]>>((acc, key) => {
          acc[key] = filesByDate[key];
          return acc;
        }, {});

      return res.status(200).json({
        files: {
          offers: files.offers,
          screenshots: screenshotsFiles,
        },
        offers: sortedFilesByDate,
      });
    } else {
      return res.status(200).json({
        files: {
          offers: [],
          screenshots: screenshotsFiles,
        },
        offers: []
      });
    }
  } catch (error) {
    console.error("Getting offers failed:", error);
    return res.status(500).json({ error: "Getting offers failed" });
  }
}
