import { useQuery } from '@tanstack/react-query';

/**
 * Interface for type-safe spin settings
 */
interface SpinSetting {
  id: number;
  title: string;
  amount: number;
  probability: number;
}

/**
 * Fully optimized and error-free SpinSettingsPage component
 */
export default function SpinSettingsPage() {
  // Explicit type generic added to prevent TypeScript unknown/any errors
  const { data: settings, isLoading, isError } = useQuery<SpinSetting[]>({
    queryKey: ['spin-settings'],
    queryFn: async () => {
      const response = await fetch('/api/spin-settings');

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return response.json();
    },

    // Cache for 1 minute (60000ms)
    staleTime: 60_000,

    // Auto-refetch every 5 minutes (300000ms)
    refetchInterval: 5 * 60_000,
  });

  // Loading state with spinner
  if (isLoading) {
    return (
      <p className="text-gray-500 flex items-center">
        <span className="inline-block animate-spin w-4 h-4 mr-2 border-2 border-gray-400 border-t-transparent rounded-full" />
        Loading spin settings...
      </p>
    );
  }

  // Error state with user-friendly message
  if (isError) {
    return (
      <p className="text-red-600 flex items-center">
        <span className="mr-2">❌</span>
        Error loading spin settings. Please try again.
      </p>
    );
  }

  // Safe fallback array to prevent undefined mapping errors
  const settingList = settings || [];

  // Empty state if no settings found
  if (settingList.length === 0) {
    return (
      <p className="text-gray-500 italic flex items-center">
        <span className="mr-2">ℹ️</span> No spin settings found
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center">
        <span className="mr-2">⚙️</span> Spin Settings
      </h2>

      <ul className="space-y-2">
        {settingList.map((setting) => (
          <li
            key={setting.id}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
          >
            <span className="text-amber-500">⭐</span>
            <span className="font-medium text-gray-700">
              {setting.title}
            </span>
            : ${setting.amount.toFixed(2)}
            (Prob: {setting.probability}%)
          </li>
        ))}
      </ul>
    </div>
  );
}