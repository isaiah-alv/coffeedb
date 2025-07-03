"use client";

import { HiOutlineTrash } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function RemoveBtn({ id }) {
  const router = useRouter();
  const removeCafe = async () => {
    const confirmed = confirm("Are you sure you want to delete this café?");

    if (confirmed) {
      const res = await fetch(`http://localhost:3000/api/cafes?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh();
      }
    }
  };

  return (
    <button 
      onClick={removeCafe} 
      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      title="Delete café"
    >
      <HiOutlineTrash size={18} />
    </button>
  );
}