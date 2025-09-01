import { Navbar } from "@/components/Navbar";
import { Inter, Playfair_Display } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";



const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

export const metadata = {
  title: "the_coffee_db",
  description: "Discover, rate, and share your favorite cafes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${playfair.variable} coffee-body`}>
        <Providers>
          <div className="min-h-screen">
            <Navbar/>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
