import { useDailySpin } from '@/utils/api-client';

export default function SpinPage() {
  const { mutate: spin, isLoading } = useDailySpin();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div class="spin-page">
      <h2>Daily Lucky Spin</h2>
      <button onClick={() => spin()} disabled={isLoading}>
        {isLoading ? 'Spinning...' : 'Spin Wheel'}
      </button>
      {error && <p class="error">{error}</p>}
    </div>
  );
}