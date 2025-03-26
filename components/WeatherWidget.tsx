import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Sun, Cloud, CloudRain } from "lucide-react";

const WeatherWidget = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weather</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Location and Current Weather */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center text-gray-600 mb-1">
              <MapPin size={16} className="mr-1" />
              <span>Ljubljana</span>
            </div>
            <div className="text-4xl font-bold">8°C</div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <Sun className="text-yellow-400 mr-1" size={20} />
              <Cloud className="text-blue-200" size={20} />
            </div>
            <div className="text-sm text-gray-600">Light rain</div>
          </div>
        </div>

        {/* Forecast */}
        <div className="border-t pt-3">
          {/* Today */}
          <div className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm text-gray-500">February 26</div>
              <div className="font-medium">Today</div>
            </div>
            <div className="flex items-center">
              <Sun className="text-yellow-400 mr-1" size={16} />
              <Cloud className="text-blue-200" size={16} />
            </div>
            <div className="text-right">
              <span className="font-medium">8°C</span>
              <span className="text-gray-500 ml-2">4°C</span>
            </div>
          </div>

          {/* Tomorrow */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <div className="text-sm text-gray-500">February 27</div>
              <div className="font-medium">Tomorrow</div>
            </div>
            <div className="flex items-center">
              <CloudRain className="text-blue-400" size={16} />
            </div>
            <div className="text-right">
              <span className="font-medium">4°C</span>
              <span className="text-gray-500 ml-2">3°C</span>
            </div>
          </div>

          {/* Friday */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div>
              <div className="text-sm text-gray-500">February 28</div>
              <div className="font-medium">Friday</div>
            </div>
            <div className="flex items-center">
              <Cloud className="text-gray-300" size={16} />
            </div>
            <div className="text-right">
              <span className="font-medium">8°C</span>
              <span className="text-gray-500 ml-2">3°C</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
