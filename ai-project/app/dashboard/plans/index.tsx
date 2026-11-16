import { useInvestPlan } from '@/utils/api-client';

export default function PlansPage() {
  const { mutate: invest, isLoading } = useInvestPlan();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div class="plans-page">
      <h2>Invest in Plan</h2>
      <button onClick={() => invest(1)} disabled={isLoading}>
        Invest in Basic Plan
      </button>
      {error && <p class="error">{error}</p>}
    </div>
  );
}