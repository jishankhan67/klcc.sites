import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function UsersPage() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/users');
      return data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {users?.map((user: any) => (
          <li key={user.id}>
            {user.username}: Balance ${user.balance}
          </li>
        ))}
      </ul>
    </div>
  );
}