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
      
      {/* 손 모양 아이콘 (mouse.svg 기반) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34"
        height="34"
        viewBox="0 0 207 207"
        className="swipe-hand-icon absolute text-[var(--text-primary)] drop-shadow-lg"
        style={{ top: '-1px', left: '-16px' }}
      >
        <path
          d="M 165.48,83.19 C 161.98,83.19 159.19,83.92 156.79,85.41 C 155.56,76.73 148.11,70.18 139.43,70.18 C 135.21,70.18 131.71,71.41 129.06,73.36 C 125.86,66.67 119.73,62.45 113.32,62.45 C 109.53,62.45 106.74,63.18 105.25,64.41 V 23.71 C 105.25,13.36 97.52,5.63 88.31,5.63 C 78.81,5.63 71.36,13.65 71.36,23.42 V 115.89 L 57.2,102.91 C 52.69,98.69 47.59,97.46 42.79,97.46 C 32.73,97.46 23.23,104.01 23.23,113.51 C 23.23,117.45 24.72,120.95 27.48,123.99 L 82.93,189.44 C 90.07,197.76 98.99,202.12 108.05,202.12 H 143.94 C 157.81,202.12 169.68,192.62 173.91,178.46 L 181.64,153.28 C 183.38,147.44 183.67,143.8 183.67,134.59 V 101.27 C 183.67,91.49 175.65,83.19 165.48,83.19 Z M 173.62,137.94 C 173.62,144.78 173.18,147.53 171.69,152.34 L 164.71,175.26 C 161.16,186.55 153.14,192.1 142.21,192.1 H 108.05 C 100.03,192.1 93.77,189.11 88.66,182.56 L 34.72,117.4 C 33.54,115.91 33.25,114.73 33.25,113.55 C 33.25,109.61 38.36,106.91 42.88,106.91 C 46.82,106.91 50.07,108.69 53.06,111.68 L 72.62,130.66 C 73.8,131.84 74.68,132.42 76.17,132.42 C 79.16,132.42 80.38,130.08 80.38,127.64 V 23.42 C 80.38,17.87 84.32,14.52 88.55,14.52 C 93.35,14.52 96.89,18.16 96.89,23.12 V 97.46 C 96.89,100.71 98.68,102.2 101.12,102.2 C 104.06,102.2 105.55,100.12 105.55,97.46 V 80.26 C 105.55,74.71 110.06,72.06 113.61,72.06 C 118.41,72.06 121.66,76.58 121.66,80.52 V 102.2 C 121.66,105.19 123.74,106.93 126.49,106.93 C 128.83,106.93 131.13,104.85 131.13,102.2 V 87.74 C 131.13,82.49 135.35,79.55 139.29,79.55 C 144.35,79.55 148.04,84.06 148.04,88.29 V 109.38 C 148.04,112.63 149.83,114.71 152.58,114.71 C 155.52,114.71 157.31,112.33 157.31,109.38 V 101.06 C 157.31,95.51 161.53,92.86 165.48,92.86 C 170.28,92.86 173.62,97.08 173.62,101.31 V 137.94 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
);
