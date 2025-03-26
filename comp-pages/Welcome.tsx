
import WeatherWidget from "@/components/WeatherWidget";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageTitle title="Welcome to Slovenia" description="Discover the hidden gem of Europe with enchanting landscapes and rich history" />
      {/* Banner Section */}
      <div className="relative h-[500px] mb-8">
        <img
          src="/lovable-uploads/59dc8b55-5707-4c7f-857e-c644a454ffc4.png"
          alt="Lake Bled, Slovenia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white text-center">Welcome to Slovenia</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="lg:w-2/3">
            <div className="prose max-w-none">
              <h2 className="text-3xl font-bold mb-6">Slovenia awaits</h2>
              <p>Nestled in the heart of Europe, Slovenia is a land of enchanting landscapes, rich history, and warm hospitality. Despite being one of the continent's smallest countries, Slovenia packs a punch when it comes to offering travellers an unforgettable experience. If you're seeking a destination that seamlessly blends natural beauty, cultural heritage, and outdoor adventures, Slovenia is the perfect choice. Let's embark on a journey to explore this hidden gem of Europe.</p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Geography and Location</h3>
              <p>Slovenia's compact size belies its diverse geography. Situated in the south-central part of Europe, it shares borders with Italy, Austria, Hungary, and Croatia. Its location at the crossroads of Europe means that within a few hours, you can go from the Adriatic Sea to the towering peaks of the Julian Alps.</p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Natural Wonders</h3>
              <p>Slovenian Alps: The Slovenian Alps, including the Julian and Kamnik-Savinja Alps, are a paradise for outdoor enthusiasts. Hikers, climbers, and skiers flock to these mountains to explore pristine alpine landscapes. Triglav National Park, home to the country's highest peak, Mount Triglav, is a must-visit.</p>

              <h3 className="text-2xl font-bold mt-8 mb-4">Lakes and Caves</h3>
              <p>Slovenia boasts numerous crystal-clear lakes, with Lake Bled and Lake Bohinj being among the most famous. But don't miss out on the mysterious underground world of Slovenia's caves, especially the UNESCO-listed Škocjan Caves and the Postojna Cave system.</p>

              {/* ... Continue with the rest of the sections ... */}
              <p className="mt-8">So what are you waiting for...</p>
              <p>Slovenia, with its natural beauty, rich heritage, and adventure opportunities, is a traveler's dream destination. Whether you seek relaxation on the Adriatic coast or thrilling hikes in the Alps, Slovenia has it all. Discover this hidden treasure in the heart of Europe, and let it captivate your senses, leaving you with unforgettable memories of a land where beauty knows no bounds.</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Travel Guides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Travel Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                      Slovenia Visa and Entry Requirements for European Getaway
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                      Slovenia Language and Customs: A Guide to Local Etiquette
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                      Winter in Slovenia: Unlocking the Best of Thrilling Winter Adventures
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                      Beekeeping in Radovljica: The Sweet Secrets of its Authentic Beekeeping Tradition
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                      A quick guide to Slovenian cuisine
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
