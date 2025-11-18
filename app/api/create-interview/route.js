import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No body' }, { status: 400 });
    }
    const mock_id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
    return NextResponse.json({ success: true, mock_id }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Server error', detail: e?.message ?? '' }, { status: 500 });
  }
}
