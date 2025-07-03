"use client";

import Link from "next/link";
import { useState } from "react";
import AboutModal from "./AboutModal";

export const Navbar = () => {
   const [isAboutOpen, setIsAboutOpen] = useState(false);

   return(
      <>
         <nav className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-8 py-6">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
               <Link 
                  className="text-2xl font-light text-amber-800 hover:text-amber-600 transition-colors" 
                  href={"/"}
               >
                  the_coffee_db
               </Link>
               
               <div className="flex items-center space-x-4">
                  <button
                     onClick={() => setIsAboutOpen(true)}
                     className="px-4 py-2 text-amber-700 hover:text-amber-800 hover:bg-amber-100 rounded-lg transition-colors font-medium"
                  >
                     About
                  </button>
                  <Link  
                     className="px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-colors shadow-sm" 
                     href={"/addCafe"}
                  >
                     Add Café
                  </Link>
               </div>
            </div>
         </nav>

         <AboutModal 
            isOpen={isAboutOpen} 
            onClose={() => setIsAboutOpen(false)} 
         />
      </>
   )
}