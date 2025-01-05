import connectMongoDB from '@/src/libs/mongodb';
import Offer from '@/src/models/Offer';
import {NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    console.log('✅ Connected to MongoDB');

    const offer = await request.json();
    await Offer.insertMany(offer);
    console.log('✅ Offer inserted successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'record has been inserted!',
      },
      {status: 201}
    );
  } catch (error) {
    console.error('❌ Database insertion error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to insert record!',
      },
      {status: 500}
    );
  }
}

export async function GET(request: NextRequest) {
  connectMongoDB();

  const {searchParams} = new URL(request.url);
  const date = searchParams.get('date');

  const startDate = new Date(date as string);
  startDate.setUTCHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setUTCHours(23, 59, 59, 999);

  try {
    const offers = await Offer.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (!offers) {
      return NextResponse.json({
        success: true,
        offers: null,
      });
    }

    const offersByDate = offers.reduce((acc, offer) => {
      const offerDate = offer.createdAt.toISOString().split('T')[0];

      if (!acc[offerDate]) {
        acc[offerDate] = [];
      }

      acc[offerDate].push(offer);

      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      offers: offersByDate,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed get',
      },
      {status: 500}
    );
  }
}

export async function DELETE(request: NextRequest) {
  connectMongoDB();
  const url = request.nextUrl.searchParams.get('url');
  try {
    await Offer.findByIdAndDelete(url);
    return NextResponse.json(
      {
        success: true,
        message: 'Record deleted',
      },
      {
        status: 200,
      }
    );
  } catch {
    return NextResponse.json(
      {
        error: 'Record deleting failed',
      },
      {
        status: 500,
      }
    );
  }
}
