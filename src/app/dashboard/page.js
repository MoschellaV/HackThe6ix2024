'use client';
import { useUserContext } from '@/context/UserContext';

export default function Dashboard() {
  const { user } = useUserContext();

  console.log(user);

  return <>Dashboard</>;
}
