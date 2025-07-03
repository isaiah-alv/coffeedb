// app/components/CafeList.jsx
import Link from 'next/link';
import RemoveBtn from './RemoveBtn';
import { HiPencilAlt } from 'react-icons/hi';

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

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cafes.map((c) => (
          <div
            key={c._id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-amber-300 transition-colors"
          >
            <div className="p-6">
              <h2 className="font-medium text-xl mb-3 text-gray-800">{c.name}</h2>
              
              {/* Ratings */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-700">
                  <span className="text-amber-600 mr-2">☕</span>
                  <span className="text-sm">Coffee: {c.ratings.coffee}/10</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-amber-600 mr-2">🎶</span>
                  <span className="text-sm">Atmosphere: {c.ratings.atmosphere}/10</span>
                </div>
              </div>

              {/* Address */}
              <div className="text-gray-600 text-sm space-y-1">
                <div className="font-medium text-gray-700 mb-2">Address:</div>
                <p>{c.address.street}</p>
                <p>{c.address.city}, {c.address.state}</p>
                {c.address.postalCode && <p>{c.address.postalCode}, {c.address.country}</p>}
                {!c.address.postalCode && <p>{c.address.country}</p>}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
              <RemoveBtn id={c._id} />
              <Link 
                href={`/editCafe/${c._id}`}
                className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              >  
                <HiPencilAlt size={18} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {cafes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">☕</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No cafés yet</h3>
          <p className="text-gray-500">Add your first café to get started!</p>
        </div>
      )}
    </div>
  );
}
