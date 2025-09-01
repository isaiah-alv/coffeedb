import CafeList  from "@/components/CafeList";

export default function Home() {
  return (
    <>
      <section className="max-w-6xl mx-auto px-2 sm:px-4 mb-6">
        <h1 className="text-3xl heading-serif"  style={{color:'var(--text)'}}>Find Great Coffee Spots and Ratings.</h1>
        <p className="mt-2" style={{color:'var(--text)'}}>Browse cafes, compare ratings, and share your favorites.</p>
      </section>
      <CafeList/>
    </>
  );
}
