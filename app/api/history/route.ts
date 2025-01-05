import fs from 'fs';
import path from 'path';
import {getDateFromFileName} from '@/src/utils/dates';
import {NextRequest, NextResponse} from 'next/server';
import Offer from '@/src/models/Offer';
import connectMongoDB from '@/src/libs/mongodb';
import {IProcessFolder, IProcessOffers, IProcessScreeshots, IResult} from '@/src/interfaces/IProcess';
import {config} from '@/app/config';

export async function GET(request: NextRequest) {
  await connectMongoDB();
  const {searchParams} = new URL(request.url);
  const date = searchParams.get('date');
  const name = searchParams.get('name');
  const names: string[] = typeof name === 'string' ? JSON.parse(name) : [];

  if (!names || !Array.isArray(names) || !names.length) {
    return NextResponse.json({error: 'Internal Server Error [invalid or missing name]'}, {status: 400});
  }

  try {
    const offersMainDir = path.join(process.cwd(), 'src', 'public', 'output', 'offers');
    const screenshotsMainDir = path.join(process.cwd(), 'src', 'public', 'output', 'screenshots');

    const result: IResult = {
      files: {offers: [], screenshots: []},
      offers: {},
      screenshots: {},
    };
    const {mode = 'file'} = config;

    await Promise.all([processOffers({offersMainDir, names, date, result}, mode), processScreenshots({screenshotsMainDir, names, date, result}, mode)]);

    return NextResponse.json(result, {status: 200});
  } catch (error) {
    console.error('❌ Getting offers and screenshots failed:', error);
    return NextResponse.json({error: 'Getting offers and screenshots failed'}, {status: 500});
  }
}

const processFolder = async ({mainDir, folderName, date, fileProcessor}: IProcessFolder) => {
  const folderPath = path.join(mainDir, folderName);
  const files = await fs.promises.readdir(folderPath);

  await Promise.all(
    files.map(async (fileName) => {
      const fileDate = getDateFromFileName(fileName);
      if (!fileDate || isNaN(new Date(fileDate).getTime())) {
        console.warn('Skipping file with invalid date:', fileName, 'File date:', fileDate);
        return;
      }

      if (fileDate && date?.from && new Date(fileDate) >= new Date(date.from)) {
        await fileProcessor(fileDate, fileName, folderPath);
      } else {
        console.warn('Skipping file due to invalid or unmatched date:', fileName, 'File date:', fileDate);
      }
    })
  );
};

const processOffers = async ({offersMainDir, names, date, result}: IProcessOffers, mode: string) => {
  let offersFolders;
  let offers;
  const processedData = date ? JSON.parse(date) : null;

  if (processedData) {
    processedData.from = new Date(processedData.from);
    processedData.to = new Date(processedData.to);

    if (isNaN(processedData.from.getTime()) || isNaN(processedData.to.getTime())) {
      console.error('Invalid date values:', processedData.from, processedData.to);
      return NextResponse.json({error: 'Invalid date values'}, {status: 400});
    }

    processedData.from.setUTCHours(0, 0, 0, 0);
    processedData.to.setUTCHours(23, 59, 59, 999);
  }

  if (mode === 'db' || mode === 'both') {
    if (processedData && processedData.from && processedData.to) {
      offers = await Offer.find({
        createdAt: {
          $gte: processedData.from,
          $lt: processedData.to,
        },
      });
    } else {
      offers = await Offer.find();
    }
    await offers.forEach((offer) => {
      const offerDate = new Date(offer.createdAt);

      if (isNaN(offerDate.getTime())) {
        console.error('Invalid offer date:', offer.createdAt);
        return;
      }

      const formattedOfferDate = offerDate.toISOString().split('T')[0];
      result.offers[formattedOfferDate] = result.offers[formattedOfferDate] || [];
      result.offers[formattedOfferDate].push(offer);
    });
  }

  if (mode === 'file' || mode === 'both') {
    offersFolders = await fs.promises.readdir(offersMainDir);

    if (!offersFolders) {
      return NextResponse.json({error: 'Missing offers folders'}, {status: 400});
    }

    await Promise.all(
      offersFolders
        .filter((folderName) => names.includes(folderName))
        .map((folderName) =>
          processFolder({
            mainDir: offersMainDir,
            folderName,
            date: processedData && processedData.from && processedData.to ? processedData : null,
            fileProcessor: async (fileDate, fileName, folderPath) => {
              const offerPath = path.join(folderPath, fileName);
              const offerContent = await fs.promises.readFile(offerPath, 'utf8');
              const data = JSON.parse(offerContent);

              if (data.offers && mode === 'file') {
                result.offers[fileDate] = result.offers[fileDate] || [];
                result.offers[fileDate].push(...data.offers);
              }
              result.files.offers.push(fileName);
            },
          })
        )
    );
  }
};

const processScreenshots = async ({screenshotsMainDir, names, date, result}: IProcessScreeshots, mode: string) => {
  if (mode === 'db') {
    return;
  }

  const processedData = date ? JSON.parse(date) : null;

  if (processedData) {
    processedData.from = new Date(processedData.from);
    processedData.to = new Date(processedData.to);

    if (isNaN(processedData.from.getTime()) || isNaN(processedData.to.getTime())) {
      return NextResponse.json({error: 'Invalid date values'}, {status: 400});
    }

    processedData.from.setUTCHours(0, 0, 0, 0);
    processedData.to.setUTCHours(23, 59, 59, 999);
  }

  const screenshotsFolders = await fs.promises.readdir(screenshotsMainDir);

  if (!screenshotsFolders) {
    return NextResponse.json({error: 'Missing screenshoot folders'}, {status: 400});
  }

  await Promise.all(
    screenshotsFolders
      .filter((folderName) => names.includes(folderName))
      .map((folderName) =>
        processFolder({
          mainDir: screenshotsMainDir,
          folderName,
          date: processedData && processedData.from && processedData.to ? processedData : null,
          fileProcessor: async (fileDate, fileName) => {
            result.screenshots[fileDate] = result.screenshots[fileDate] || [];
            result.screenshots[fileDate].push(fileName);
            result.files.screenshots.push(fileName);
          },
        })
      )
  );
};
