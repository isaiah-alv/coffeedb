import Link from "next/link";
import RemoveBtn from "./RemoveBtn";
import { HiPencilAlt } from "react-icons/hi";

const getCafes = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/cafes", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch cafes");
    }

    return res.json();
  } catch (error) {
    console.log("Error loading cafes: ", error);
  }
};

export default async function CafeList() {
  const {cafes} = await getCafes();
  return (
    <>
      {cafes.map((c) => (
        <div
          key={c._id}
          className="bg-slate-200 p-5 shadow-xl my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="font-bold text-2xl">{c.name}</h2>
            <p>Coffee Rating: {c.ratings.coffee}/10</p>
            <p>Atmosphere Rating: {c.ratings.atmosphere}/10</p>
            <div>
              <strong>Address:</strong>
              <p>{c.address.street}, {c.address.city}</p>
              <p>{c.address.postalCode}, {c.address.country}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <RemoveBtn id={c._id} />
            <Link href={`/editCafe/${c._id}`}>
                <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}
