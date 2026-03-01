import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1
        className="text-4xl font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        404
      </h1>
      <p
        className="text-lg"
        style={{ color: 'var(--text-secondary)' }}
      >
        페이지를 찾을 수 없습니다.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg px-6 py-2 text-sm"
        style={{
          backgroundColor: 'var(--kraft-dark)',
          color: 'var(--kraft-light)',
        }}
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
