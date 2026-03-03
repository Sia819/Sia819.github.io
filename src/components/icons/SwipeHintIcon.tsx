import React from 'react';

export const SwipeHintIcon = ({ className = '', ...props }: React.SVGProps<SVGSVGElement>) => (
  <div className={`relative w-24 h-16 flex items-center justify-center ${className}`} {...(props as any)}>
    {/* 스와이프 트랙 (캡슐 배경) */}
    <div className="absolute w-20 h-7 rounded-full border border-[var(--text-muted)] opacity-[0.25] flex items-center justify-center overflow-hidden">
      {/* 왼쪽 방향을 알려주는 더블 화살표 가이드 */}
      <div className="flex -space-x-1.5 opacity-60">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </div>
    </div>
    
    {/* 터치 및 손가락 이동 컨테이너 */}
    <div className="swipe-gesture-container absolute top-1/2 left-1/2 w-0 h-0">
      {/* 화면 터치 시 퍼지는 물결 효과 */}
      <div className="swipe-ripple absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-[var(--text-muted)] opacity-0" />
      
      {/* 화면 터치 지점을 뚜렷하게 보여주는 점 */}
      <div className="swipe-touch-dot absolute w-2.5 h-2.5 -ml-[5px] -mt-[5px] rounded-full bg-[var(--text-muted)] opacity-0 shadow-sm" />
      
      {/* 손가락 사이가 모여있는 깔끔한 형태의 검지 손가락 포인터 (Phosphor hand-pointing regular) */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="34" 
        height="34" 
        viewBox="0 0 256 256" 
        className="swipe-hand-icon absolute text-[var(--text-primary)] drop-shadow-lg"
        style={{ top: '-1px', left: '-16px' }}
      >
        {/* 뒷배경을 데스크 색상으로 채우기 (손가락 형태의 외곽선 부분만) */}
        <path 
          d="M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Z" 
          fill="var(--desk)" 
        />
        {/* 실제 아이콘 드로잉 (선 색상을 텍스트 색상으로) */}
        <path 
          d="M196,88a27.86,27.86,0,0,0-13.35,3.39A28,28,0,0,0,144,74.7V44a28,28,0,0,0-56,0v80l-3.82-6.13A28,28,0,0,0,35.73,146l4.67,8.23C74.81,214.89,89.05,240,136,240a88.1,88.1,0,0,0,88-88V116A28,28,0,0,0,196,88Zm12,64a72.08,72.08,0,0,1-72,72c-37.63,0-47.84-18-81.68-77.68l-4.69-8.27,0-.05A12,12,0,0,1,54,121.61a11.88,11.88,0,0,1,6-1.6,12,12,0,0,1,10.41,6,1.76,1.76,0,0,0,.14.23l18.67,30A8,8,0,0,0,104,152V44a12,12,0,0,1,24,0v68a8,8,0,0,0,16,0V100a12,12,0,0,1,24,0v20a8,8,0,0,0,16,0v-4a12,12,0,0,1,24,0Z" 
          fill="currentColor" 
        />
      </svg>
    </div>
  </div>
);
