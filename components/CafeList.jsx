// app/components/CafeList.jsx (Server component)
import CafeListClient from './CafeListClient';

const getCafes = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/cafes', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch cafes');
    return res.json();
  } catch (error) {
    console.error('Error loading cafes: ', error);
    return { cafes: [] };
  }
};

export default async function CafeList() {
  const { cafes } = await getCafes();

  return <CafeListClient cafes={cafes} />;
}
