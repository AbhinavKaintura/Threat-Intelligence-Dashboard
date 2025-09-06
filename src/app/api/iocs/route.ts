import { NextResponse } from 'next/server';
import { IOC } from '@/types/ioc';

// Simulate API delay for realistic loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  try {
    // Simulate network delay
    await delay(800);

    const response = await fetch('/mock-data/threat-feeds.json');
    const data = await response.json();

    return NextResponse.json({
      data: data.iocs,
      status: 'success',
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'mock-api',
        fetchedAt: new Date().toISOString(),
        count: data.iocs.length,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        data: [], 
        status: 'error', 
        message: 'Failed to fetch threat intelligence data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
