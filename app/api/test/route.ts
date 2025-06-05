import { NextResponse } from 'next/server';
import axios from 'axios';

// Naver API credentials
const NAVER_CLIENT_ID = "8c8q8h5u6l";
const NAVER_CLIENT_SECRET = "8c8q8h5u6l";

export async function GET() {
  try {
    console.log('Testing Naver API with credentials:', {
      clientId: NAVER_CLIENT_ID,
      clientSecret: NAVER_CLIENT_SECRET
    });

    const searchResponse = await axios({
      method: 'get',
      url: 'https://openapi.naver.com/v1/search/local.json',
      params: {
        query: '명동 맛집',
        display: 5
      },
      headers: {
        'X-Naver-Client-Id': NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': NAVER_CLIENT_SECRET
      }
    });

    console.log('Naver API Response:', searchResponse.data);

    return NextResponse.json({
      success: true,
      data: searchResponse.data
    });
  } catch (error: any) {
    console.error('Naver API Test Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    return NextResponse.json({
      success: false,
      error: {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      }
    }, { status: 500 });
  }
} 