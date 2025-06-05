'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [input, setInput] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });
      
      const data = await response.json();
      console.log('API 응답:', data);

      if (data.success && data.data.recommendation) {
        setSearchHistory(prev => [data.data.recommendation, ...prev]);
      } else {
        setSearchHistory(prev => ['죄송합니다. 추천을 생성하는 중에 오류가 발생했습니다.', ...prev]);
      }
      setInput('');
    } catch (error) {
      console.error('Error:', error);
      setSearchHistory(prev => ['죄송합니다. 추천을 생성하는 중에 오류가 발생했습니다.', ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const getGoogleMapsUrl = (address: string) => {
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBddekblzpw_RezfDV5TKTYCLIwfKkm5g8&q=${encodeURIComponent(address)}&language=ko`;
  };

  const getGoogleMapsLink = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}&hl=ko`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex justify-center mb-8">
          <Image
            src="/오점뭐.png"
            alt="오점뭐 로고"
            width={300}
            height={200}
            priority
            className="object-contain"
          />
        </div>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">회사 위치</h2>
          <p className="text-gray-600">서울 중구 퇴계로 24 (명동역 3번 출구에서 도보 5분)</p>
          <p className="text-gray-600 mt-2">주변 3km 이내의 맛집을 추천해드립니다.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="원하는 음식 종류를 입력하세요 (예: 오늘은 기분이 좋아서 매운 음식이 땡겨요. 분식이나 치킨이 좋을 것 같아요.)"
                className="w-full px-10 py-8 text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 px-8 py-4 bg-blue-500 text-white text-xl rounded-lg disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
              >
                {loading ? '검색 중...' : '검색'}
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-24">
          {searchHistory.map((content, index) => (
            <div key={index} className="p-8 border-2 border-gray-300 rounded-lg bg-white shadow-md">
              <div className="whitespace-pre-wrap text-base leading-8">
                {content.split('\n\n').map((paragraph, pIndex) => {
                  // 주소 추출
                  const addressMatch = paragraph.match(/주소: (.*)/);
                  const address = addressMatch ? addressMatch[1] : '';
                  
                  return (
                    <div key={pIndex} className="mb-8 p-6 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                      <div className="mb-4">{paragraph}</div>
                      {address && (
                        <div className="mt-4">
                          <div className="relative">
                            <iframe
                              width="100%"
                              height="300"
                              style={{ border: 0 }}
                              loading="lazy"
                              allowFullScreen
                              src={getGoogleMapsUrl(address)}
                            />
                            <a
                              href={getGoogleMapsLink(address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                            >
                              구글 맵에서 보기
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
} 