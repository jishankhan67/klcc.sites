import { useGetEarnings } from '@/utils/api-client';

export default function EarningsPage() {
  const { data: earnings, isLoading } = useGetEarnings();

  return (
    <div class="earnings-page">
      <h2>Earnings History</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {earnings?.map((earning: any) => (
            <li key={earning.id}>
              <span class="type">{earning.type}</span>
              <span class="amount">${earning.amount}</span>
              <span class="date">{new Date(earning.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}