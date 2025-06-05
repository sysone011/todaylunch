import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const COMPANY_ADDRESS = "서울특별시 중구 퇴계로 24";
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// 추천 기록을 저장할 Set
const recommendedRestaurants = new Set<string>();

export async function POST(request: Request) {
  try {
    const { input } = await request.json();
    console.log('검색 키워드:', input);

    // Google Places API를 사용하여 맛집 검색
    try {
      console.log('API 요청 시작');
      console.log('검색 주소:', COMPANY_ADDRESS);
      
      // 1. 먼저 주소를 좌표로 변환
      const geocodeResponse = await axios({
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        params: {
          address: COMPANY_ADDRESS,
          key: GOOGLE_API_KEY
        }
      });

      console.log('Geocoding 응답:', geocodeResponse.data);

      if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
        throw new Error('회사 주소를 찾을 수 없습니다.');
      }

      const location = geocodeResponse.data.results[0].geometry.location;
      console.log('회사 위치:', location);

      // 2. 주변 맛집 검색
      const placesResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=1000&type=restaurant&keyword=${encodeURIComponent(input)}&language=ko&key=${GOOGLE_API_KEY}`
      );
      const placesData = await placesResponse.json();

      console.log('API 응답:', placesData);

      if (!placesData.results || placesData.results.length === 0) {
        throw new Error('검색 결과가 없습니다.');
      }

      // 검색 결과에서 맛집 정보 추출
      const restaurants = await Promise.all(placesData.results.map(async (place: any) => {
        // Place Details API를 사용하여 상세 정보 가져오기
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,rating,user_ratings_total,vicinity,types,editorial_summary,price_level,serves_beer,serves_wine,menu&language=ko&key=${GOOGLE_API_KEY}`
        );
        const detailsData = await detailsResponse.json();
        
        // 메뉴 정보 추출
        let menuInfo = '';
        if (detailsData.result && detailsData.result.editorial_summary) {
          menuInfo = detailsData.result.editorial_summary.overview;
        }

        return {
          name: place.name,
          rating: place.rating,
          user_ratings_total: place.user_ratings_total,
          vicinity: place.vicinity,
          types: place.types,
          place_id: place.place_id,
          menu_info: menuInfo
        };
      }));

      console.log('=== Google Places API 검색 결과 ===');
      console.log(`검색된 맛집 수: ${restaurants.length}개`);
      restaurants.forEach((restaurant: any, index: number) => {
        console.log(`${index + 1}. ${restaurant.name} (${restaurant.rating}점)`);
        if (restaurant.menu_info) {
          console.log(`   메뉴 정보: ${restaurant.menu_info}`);
        }
      });
      console.log('============================');

      try {
        console.log('OpenAI API 호출 시작');
        // OpenAI를 사용하여 맛집 추천 생성
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `당신은 맛집 추천 전문가입니다. 주어진 맛집 목록에서 사용자의 취향에 가장 잘 맞는 맛집 하나만 추천해주세요.
              각 맛집의 평점과 리뷰 수를 고려하여 가장 적합한 맛집을 선택해주세요.
              추천할 때는 맛집의 특징과 장점을 자세히 설명해주세요.
              이미 추천한 맛집은 다시 추천하지 않도록 해주세요.
              
              다음 형식으로 추천해주세요:
              
              [맛집 이름]
              
              이 맛집은 [리뷰 수]개의 리뷰를 받아 [평점]의 높은 평점을 자랑합니다.
              [세부 주소]에 위치한 이 곳은 [특징]을 맛볼 수 있으며, [장점]도 느낄 수 있습니다.
              대표 메뉴: [menu_info 필드의 메뉴 정보]
              주소: [vicinity 필드의 전체 주소]
              
              주의사항:
              - 반드시 한글로만 작성해주세요.
              - 맛집 이름은 큰따옴표("")로 감싸주세요.
              - 주소는 반드시 vicinity 필드의 값을 그대로 사용해주세요.
              - 메뉴 정보가 있는 경우 반드시 포함해주세요.
              - 가장 적합한 맛집 하나만 추천해주세요.`
            },
            {
              role: "user",
              content: `다음은 ${input} 맛집 목록입니다. 이 중에서 추천해주세요:
              ${JSON.stringify(restaurants, null, 2)}
              
              이미 추천한 맛집 목록:
              ${Array.from(recommendedRestaurants).join(', ')}`
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });

        const recommendation = '\n\n\n' + completion.choices[0].message.content + '\n\n\n';
        console.log('OpenAI 추천:', recommendation);

        // 추천된 맛집을 기록에 추가
        const recommendedNames = recommendation.match(/[가-힣a-zA-Z0-9\s]+/g) || [];
        recommendedNames.forEach(name => recommendedRestaurants.add(name.trim()));

        return NextResponse.json({
          success: true,
          data: {
            restaurants: restaurants,
            recommendation: recommendation
          }
        });
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        return NextResponse.json({
          success: false,
          error: '맛집 추천 생성 중 오류가 발생했습니다.',
          details: openaiError.message
        }, { status: 500 });
      }
    } catch (error) {
      console.error('Google Places API Error:', error);
      if (error.response) {
        console.error('Error Response:', error.response.data);
        console.error('Error Status:', error.response.status);
        console.error('Error Headers:', error.response.headers);
      }
      return NextResponse.json({
        success: false,
        error: '맛집 검색 중 오류가 발생했습니다.',
        details: error.response ? error.response.data : error.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: '요청 처리 중 오류가 발생했습니다.',
      details: error.message
    }, { status: 500 });
  }
} 