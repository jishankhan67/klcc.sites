import { useMalaysiaDeposit } from '@/utils/api-client';

export default function DepositPage() {
  const { mutate: deposit, isLoading } = useMalaysiaDeposit();
  const [error, setError] = React.useState<string | null>(null);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number((e.target as HTMLFormElement).amount.value);
    const gateway = (e.target as HTMLSelectElement).value;
    await deposit({ amount, gateway });
  };

  return (
    <div class="deposit-page">
      <h2>Deposit Funds</h2>
      <form onSubmit={handleDeposit}>
        <input type="number" name="amount" min="1" required />
        <select name="gateway">
          <option value="duitnow">DuitNow</option>
          <option value="fpx">FPX</option>
          <option value="tng">TNG</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Deposit'}
        </button>
      </form>
      {error && <p class="error">{error}</p>}
    </div>
  );
}