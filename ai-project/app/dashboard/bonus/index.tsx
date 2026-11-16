import { useRegisterBonus } from '@/utils/api-client';

export default function BonusPage() {
  const { mutate: register, isLoading } = useRegisterBonus();
  const [error, setError] = React.useState<string | null>(null);

  return (
    <div class="bonus-page">
      <h2>Register Bonus</h2>
      <input type="text" placeholder="Bonus code" />
      <button onClick={() => register('BONUS123')} disabled={isLoading}>
        Register
      </button>
      {error && <p class="error">{error}</p>}
    </div>
  );
}