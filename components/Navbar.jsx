import Link from "next/link";

export const Navbar = () => {
   return(
      <nav className="flex justify-between items-center bg-slate-300 px-8 py-5">
         <Link className="text-orange-900 text-xl font-bold" href={"/"}>the_coffee_db</Link>
         <Link  className="bg-white p-3 hover:bg-slate-200" href={"/addCafe"}>add cafe + rating</Link>
      </nav>
   )
}