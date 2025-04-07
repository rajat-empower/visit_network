import axios from 'axios';

class NinjaAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.api-ninjas.com/v1';

  constructor() {
    this.apiKey = process.env.NINJA_API_KEY || '';
    if (!this.apiKey) {
      console.warn('NINJA_API_KEY not found in environment variables');
    }
  }

  async getCityPopulation(cityName: string): Promise<number | null> {
    try {
      console.log('Fetching population for city:', cityName);
      const response = await axios.get(`${this.baseURL}/city?name=${encodeURIComponent(cityName)}`, {
        headers: {
          'X-Api-Key': this.apiKey
        }
      });

      console.log('Ninja API Response for', cityName, ':', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.length > 0) {
        const population = response.data[0].population;
        console.log(`Population found for ${cityName}: ${population.toLocaleString()} inhabitants`);
        return population;
      }

      console.log(`No population data found for ${cityName}`);
      return null;
    } catch (error) {
      console.error(`Error fetching population for ${cityName}:`, error);
      return null;
    }
  }
}

export const ninjaAPI = new NinjaAPI(); 