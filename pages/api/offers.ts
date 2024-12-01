import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { IOffer } from '@/interfaces/IOffer';
import { getDateFromFileName } from '@/utils/getDateFromFileName';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { date, name } = req.query;

  let names: string[] = [];
  if (name) {
    try {
      names = typeof name === 'string' ? JSON.parse(name) : [];
      if (!Array.isArray(names)) {
        throw new Error('Invalid name parameter');
      }
    } catch {
      return res.status(400).json({ error: "Invalid 'name' parameter format" });
    }
  }

  if (!names.length) {
    return res.status(400).json({ error: "Missing or empty 'name' parameter" });
  }

  try {
    const offersMainDir = path.join(
      process.cwd(),
      'public',
      'output',
      'offers'
    );
    const screenshotsMainDir = path.join(
      process.cwd(),
      'public',
      'output',
      'screenshots'
    );

    const result = {
      files: { offers: [] as string[], screenshots: [] as string[] },
      offers: {} as Record<string, IOffer[]>,
      screenshots: {} as Record<string, string[]>,
    };

    const processFolder = async (
      mainDir: string,
      folderName: string,
      fileProcessor: (
        fileDate: string,
        fileName: string,
        folderPath: string
      ) => Promise<void>
    ) => {
      const folderPath = path.join(mainDir, folderName);
      const files = await fs.promises.readdir(folderPath);

      await Promise.all(
        files.map(async (fileName) => {
          const fileDate = getDateFromFileName(fileName);
          if (
            fileDate &&
            (!date || new Date(fileDate) >= new Date(date as string))
          ) {
            await fileProcessor(fileDate, fileName, folderPath);
          }
        })
      );
    };

    const processOffers = async () => {
      const offersFolders = await fs.promises.readdir(offersMainDir);

      await Promise.all(
        offersFolders
          .filter((folderName) => names.includes(folderName))
          .map((folderName) =>
            processFolder(
              offersMainDir,
              folderName,
              async (fileDate, fileName, folderPath) => {
                const offerPath = path.join(folderPath, fileName);
                const offerContent = await fs.promises.readFile(
                  offerPath,
                  'utf8'
                );
                const data = JSON.parse(offerContent);

                if (data.offers) {
                  result.offers[fileDate] = result.offers[fileDate] || [];
                  result.offers[fileDate].push(...data.offers);
                }
                result.files.offers.push(fileName);
              }
            )
          )
      );
    };

    const processScreenshots = async () => {
      const screenshotsFolders = await fs.promises.readdir(screenshotsMainDir);

      await Promise.all(
        screenshotsFolders
          .filter((folderName) => names.includes(folderName))
          .map((folderName) =>
            processFolder(
              screenshotsMainDir,
              folderName,
              async (fileDate, fileName) => {
                result.screenshots[fileDate] =
                  result.screenshots[fileDate] || [];
                result.screenshots[fileDate].push(fileName);
                result.files.screenshots.push(fileName);
              }
            )
          )
      );
    };

    await Promise.all([processOffers(), processScreenshots()]);

    res.status(200).json(result);
  } catch (error) {
    console.error('Getting offers and screenshots failed:', error);
    res.status(500).json({ error: 'Getting offers and screenshots failed' });
  }
}
