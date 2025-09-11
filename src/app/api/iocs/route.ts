import { NextResponse } from 'next/server';
import { IOC } from '@/types/ioc';
import fs from 'fs';
import path from 'path';

// Simulate API delay for realistic loading states
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  try {
    console.log('=== IOC API Route Called ===');
    
    // Simulate network delay
    await delay(800);

    // Read the mock data file from the public directory
    const filePath = path.join(process.cwd(), 'public', 'mock-data', 'threat-feeds.json');
    console.log('Reading threat intelligence data from:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Mock data file not found at:', filePath);
      throw new Error(`Mock data file not found at: ${filePath}`);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('File contents length:', fileContents.length);
    
    const data = JSON.parse(fileContents);
    console.log('Parsed data structure:', {
      hasIOCs: !!data.iocs,
      iocsLength: data.iocs?.length || 0,
      firstIOC: data.iocs?.[0]?.id || 'none'
    });

    const response = {
      iocs: data.iocs,
      status: 'success',
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'mock-api',
        fetchedAt: new Date().toISOString(),
        count: data.iocs.length,
      }
    };
    
    console.log('Returning response with', response.iocs.length, 'IOCs');
    return NextResponse.json(response);
  } catch (error) {
    console.error('=== Error in IOC API Route ===');
    console.error('Error details:', error);
    return NextResponse.json(
      { 
        iocs: [], 
        status: 'error', 
        message: 'Failed to fetch threat intelligence data',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
