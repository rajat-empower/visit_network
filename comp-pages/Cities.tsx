import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { citiesAPI, articlesAPI } from '@/utils/api';
import PageTitle from '@/components/PageTitle';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WeatherWidget from "@/components/WeatherWidget";
import { LayoutGrid, List } from "lucide-react";

interface City {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  popularity: number | null;
}

interface Article {
  id: string;
  title: string;
  content: string;
  feature_img?: string;
  author?: string;
  tags?: string[];
  created_at?: string;
  category_id?: number;
  category?: Array<{
    uuid: number;
    category: string;
  }>;
  slug?: string;
  excerpt?: string;
}

const Cities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCities(true);
        setLoadingArticles(true);

        const citiesResponse = await citiesAPI.getCities();
        
        if (citiesResponse && typeof citiesResponse === 'object' && 'cities' in citiesResponse) {
          setCities(citiesResponse.cities as City[]);
        } else {
          console.error('Invalid response format from cities API');
        }

        const articlesResponse = await articlesAPI.getArticles({ limit: 4 });
        
        if (articlesResponse && typeof articlesResponse === 'object' && 'articles' in articlesResponse) {
          setArticles(articlesResponse.articles as Article[]);
        } else {
          console.error('Invalid response format from articles API');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingCities(false);
        setLoadingArticles(false);
      }
    };

    fetchData();
  }, []);

  const truncateText = (text: string | null | undefined, maxLines: number) => {
    if (!text) return 'No description available';
    
    const lines = text.split('\n');
    if (lines.length > maxLines) {
      return lines.slice(0, maxLines).join('\n') + '...';
    }
    return text;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <PageTitle title="Explore Cities" description="Discover the best cities in Slovenia" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#ea384c]">Explore Cities</h1>
        <div className="prose max-w-none mb-12">
          <p className="text-gray-600 leading-relaxed">
            Slovenia is a country of contrasts, where historic charm meets modern vibrancy. From the fairytale beauty of Ljubljana, with its castle-topped skyline and lively riverside cafés, to the coastal elegance of Piran, where Venetian influences shine, each city has its own unique story to tell. Whether you're exploring medieval streets, indulging in local cuisine, or uncovering hidden cultural gems, Slovenia's cities promise unforgettable experiences.
            Start your journey by exploring the best that Slovenia has to offer!
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <div className="flex gap-2 border border-gray-200 rounded-md p-1">
              <button
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
              {loadingCities ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ea384c]"></div>
                </div>
              ) : cities.length > 0 ? (
                cities.map((city) => (
                  <Card key={city.id} className="overflow-hidden group shadow-sm">
                    <div className="overflow-hidden">
                      <img
                        src={city.image_url || '/images/placeholder-city.jpg'}
                        alt={city.name}
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                      />
                    </div>
                    <CardContent>
                      <CardTitle className="text-lg font-bold text-red-500 mt-3">
                        {city.name}
                      </CardTitle>
                      <p className="text-cities">{truncateText(city.description, 6)}</p>
                      <div className="mt-4 pt-4">
                        <Link
                          href={`/cities/${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                        >
                          Explore
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  No cities found. Please try again later.
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/4 space-y-8">
            <WeatherWidget />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Travel Guides</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingArticles ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ea384c]"></div>
                  </div>
                ) : articles.length > 0 ? (
                  <ul className="space-y-4">
                    {articles.map((article) => (
                      <li key={article.id} className="border-b border-gray-100 pb-2 last:border-0">
                        <Link
                          href={`/travel-guides/${article.slug}`}
                          className="text-[#888888] hover:text-[#ea384c] block"
                        >
                          {article.title}
                        </Link>
                        {article.excerpt && (
                          <p className="text-sm text-gray-500">{article.excerpt}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-4">
                    <li>
                      <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                        Best Time to Visit Slovenia: Seasonal Guide
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                        Top 10 Must-See Attractions in Slovenia
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-[#888888] hover:text-[#ea384c] block">
                        Transportation Guide: Getting Around Slovenia
                      </Link>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-[#ea384c]">Frequently Asked Questions</h2>
          
          <div className="space-y-0 max-w-4xl">
            <div className="bg-white rounded-md border-b border-gray-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq1' ? null : 'faq1')}
              >
                <span className="font-medium text-[95%]">When is the best time to visit Slovenia?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq1' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq1' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-[95%]">
                    Slovenia is a wonderful destination year-round, with each season offering its own charm. The most popular time to visit is from May to September, when the weather is warm and ideal for outdoor activities and exploring the country's natural beauty. If you prefer fewer crowds and mild weather, consider the shoulder seasons in spring (March–May) or autumn (September–November) when you'll still enjoy pleasant conditions and vibrant scenery. Winter (December–February) brings snow – perfect for skiing in the Alps and experiencing festive Christmas markets, though some attractions (especially on the coast) will be quieter.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md border-b border-gray-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq2' ? null : 'faq2')}
              >
                <span className="font-medium text-[95%]">How do I get around Slovenia?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq2' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq2' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-[95%]">
                    Getting around Slovenia is easy due to its small size and good transportation network. Many travelers choose to <strong>rent a car</strong> for flexibility – roads are well-marked and in good condition, and driving distances are short (it takes only a couple of hours to cross the country). If you drive on highways, remember to purchase a "vignette" toll sticker, as it's required for motorways. <strong>Public buses</strong> are reliable and reach most towns, villages, and tourist sites, making them a great option if you don't want to drive. Slovenia also has <strong>trains</strong> connecting major cities and some popular areas (like Ljubljana to Lake Bled or Maribor), though the rail network is limited in remote regions. Within cities such as Ljubljana, you can easily explore on foot or use local buses (Ljubljana even has a handy bike-sharing system); the capital is compact and very walkable.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md border-b border-gray-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq3' ? null : 'faq3')}
              >
                <span className="font-medium text-[95%]">What are the must-see attractions in Slovenia?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq3' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq3' && (
                <div className="px-6 pb-6">
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 text-[95%]">
                    <li><strong>Lake Bled:</strong> A picturesque alpine lake with crystal-clear waters, famous for its tiny island topped by a church and a medieval castle perched on a cliff above the shore. You can take a traditional <em>pletna</em> boat to the island or hike up to scenic viewpoints around the lake.</li>
                    <li><strong>Ljubljana:</strong> The charming capital city, known for its vibrant café-lined riverbanks, historic architecture, and a hilltop castle overlooking the old town. Strolling the cobbled streets to sights like the Triple Bridge and Ljubljana Castle showcases the city's blend of medieval and modern appeal.</li>
                    <li><strong>Triglav National Park & Lake Bohinj:</strong> This national park in the Julian Alps is home to Slovenia's highest peak, Mt. Triglav, and the country's largest lake, tranquil Lake Bohinj. It's a paradise for nature lovers, offering breathtaking mountain scenery, hiking trails, waterfalls, and crystal-clear waters for swimming or boating.</li>
                    <li><strong>Postojna Cave & Predjama Castle:</strong> Postojna is one of the world's most impressive underground cave systems – a 24 km karst cavern you can tour by electric train to see spectacular rock formations. Nearby, the Predjama Castle is built dramatically into a cliffside cave, creating a unique medieval site to explore.</li>
                    <li><strong>Piran:</strong> A postcard-perfect coastal town on the Adriatic Sea, featuring a maze of narrow streets, Venetian Gothic architecture, and gorgeous sea views from its old city walls. Piran's Tartini Square and the hilltop church offer panoramic vistas, and it's a great place to enjoy fresh seafood by the harbor at sunset.</li>
                  </ul>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md border-b border-gray-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq4' ? null : 'faq4')}
              >
                <span className="font-medium text-[95%]">What adventure activities can I do in Slovenia?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq4' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq4' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-[95%]">
                    Slovenia is an outdoor playground for adventure-seekers, packed with activities on both land and water. You can tackle countless <strong>hiking trails</strong> in the <strong>Julian Alps</strong> – including routes in Triglav National Park and even summiting Mt. Triglav (2,864 m), the country's highest peak, for experienced hikers. The mountains also offer rock climbing and via ferrata routes for a thrill. <strong>White-water rafting and kayaking</strong> are big highlights on the <strong>emerald Soča River</strong>, which is famed for its impossibly clear turquoise rapids and suitable for both beginners and seasoned rafters. For an adrenaline rush, try <strong>canyoning</strong> – clambering, sliding, and abseiling through waterfalls and pools in gorges (popular in areas like Bled or the Soča Valley). In the winter months, Slovenia has several ski resorts (such as Kranjska Gora, Vogel, and Krvavec) for <strong>skiing and snowboarding</strong>. Other adventures include <strong>mountain biking</strong> on scenic trails, zip-lining in the treetops or over river canyons, and even <strong>paragliding</strong> above alpine lakes for a bird's-eye view of the landscape. With over half the country covered in forests and mountains, Slovenia truly has something for every adventure enthusiast.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md border-b border-gray-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq5' ? null : 'faq5')}
              >
                <span className="font-medium text-[95%]">What should I know about Slovenian culture and language?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq5' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq5' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-[95%]">
                    Slovenia may be a small country, but it has a rich cultural blend of Alpine, Mediterranean, and Slavic influences. The <strong>official language</strong> is Slovene (Slovenian), but you'll find that many locals—especially the younger generation and those in tourism—speak excellent English, so communication is usually straightforward for visitors. It's polite to learn a couple of basic Slovene phrases like <em>Dober dan</em> (hello) or <em>Hvala</em> (thank you), which locals appreciate even if you can't speak the language fluently. In terms of customs, Slovenians are generally friendly and hospitable, though sometimes a bit reserved at first. They value nature and sustainability highly (Slovenia was the <strong>first certified "Green Destination" country in the world</strong>), so be respectful of the environment—don't litter, stay on marked trails in national parks, and follow any recycling rules. Also, note that Slovenia has a strong tradition of outdoor recreation (many locals spend weekends hiking or cycling), a delicious cuisine influenced by Italian, Austrian, and Balkan flavors, and a thriving wine culture (try the local wines from regions like Primorska or Štajerska). Embracing these aspects will give you a deeper appreciation of Slovenian culture during your visit.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md border-b border-gray-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq6' ? null : 'faq6')}
              >
                <span className="font-medium text-[95%]">Do I need a visa to visit Slovenia?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq6' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq6' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-[95%]">
                    <strong>Visa requirements</strong> for Slovenia depend on your nationality, but many travelers can visit visa-free. Slovenia is part of the European Union and the Schengen Area, so <strong>EU citizens</strong> can enter with just an ID card and do not need a visa at all. <strong>Visitors from countries like the United States, Canada, Australia, New Zealand, and most of Europe do not need a visa for tourist stays of up to 90 days</strong> (within any 180-day period). If you are from a country that is not visa-exempt (for example, South Africa, India, China, etc.), you will need to apply for a Schengen tourist visa in advance. It's always best to check the latest visa requirements with the Slovenian embassy or consulate in your country before you travel, to ensure you have the correct documentation.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md border-b border-gray-300">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq7' ? null : 'faq7')}
              >
                <span className="font-medium text-[95%]">What is the currency in Slovenia, and can I use credit cards?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq7' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq7' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-[95%]">
                    Slovenia's currency is the <strong>Euro (€)</strong>, since it is a member of the Eurozone. You won't need to worry about currency exchange if you already have Euros; if not, you can easily get them at ATMs or exchange offices. <strong>Credit cards</strong> (like Visa and MasterCard) are widely accepted in cities – you can use them at most hotels, restaurants, and larger shops. However, in smaller towns, family-run establishments, markets, or for things like local bus tickets, <strong>cash is often preferred</strong>. It's a good idea to carry some cash for minor purchases and in rural areas. ATMs are plentiful in cities and tourist areas for withdrawing Euros as needed. Overall, Slovenia is quite modern with banking, so you shouldn't have trouble as long as you have a PIN-enabled credit/debit card and a bit of cash on hand for convenience.
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-md">
              <button 
                className="w-full flex justify-between items-center p-6 text-left"
                onClick={() => setOpenFaq(openFaq === 'faq8' ? null : 'faq8')}
              >
                <span className="font-medium text-[95%]">Is Slovenia safe for travelers?</span>
                <svg 
                  className={`w-5 h-5 transition-transform ${openFaq === 'faq8' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === 'faq8' && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 text-[95%]">
                    Yes – <strong>Slovenia is considered one of the safest countries in Europe and the world</strong>. It consistently ranks in the top 10 of the Global Peace Index, thanks to its low crime rates and stable society. Violent crime is very rare, and even petty crime is less common than in many other tourist destinations. Travelers generally feel comfortable walking around cities like Ljubljana, Bled, or Piran even at night. Of course, it's always wise to use common sense: keep an eye on your belongings in busy areas or on public transportation, as pickpocketing can occur in any popular tourist spot. Use the hotel safe for valuables and carry a copy of your passport rather than the original when out and about. By following standard safety precautions, you'll likely find Slovenia exceptionally welcoming and secure during your travels.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cities;
