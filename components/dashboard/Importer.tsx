import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import './Importer.css';

interface City {
  id: string;
  name: string;
  vaitorId: string;
  totalRec: number;
}



const Importer = () => {
  const [apiKey, setApiKey] = useState('77cb043f-4a94-4eed-85ff-fe246577e4ad');
  const [location, setLocation] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [totalReccord, settotalReccord] = useState(0);
  const [importedReccord, setimportedReccord] = useState(0);
  
  type RecordType = {
    id: string;
    title: string;
    description: string;
    productUrl: string;
    images: {
      variants: {
        url: string;
      }[];
    }[];
    pricing: {
      summary: {
        fromPrice: string;
      };
      currency: string;
    };
    reviews: {
      combinedAverageRating?: number;
    };
    duration: string;
    confirmationType: string;
    itineraryType: string;
    destinations: string[];
    tags: string[];
    flags: string[];
    translationInfo: unknown;
    included: string;
    additional: string;
    policy: string;
    rating: number | string;
  };

  const [importLimit, setImportLimit] = useState(10);
  const [records, setRecords] = useState<RecordType[]>([]);
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data: cityData, error } = await supabase.from('cities').select('*').not('vaitor_id', 'is', null);
        if (error) {
          console.error('Error fetching city data:', error);
          return;
        }

        const updatedCities: City[] = cityData.map((city: any) => ({
          id: city.id,
          name: city.name,
          vaitorId: city.vaitor_id ? city.vaitor_id.toString() : '',
          totalRec: city.tour_imported || 0
        }));

        setCities(updatedCities);
      } catch (error) {
        console.error('Unexpected error:', error);
      }
    };

    fetchCities();
  }, []);

  async function fetchTourCount(city_id: string) {
    const { data: existingRecords, error: fetchError } = await supabase
      .from('tours')
      .select('city_id')
      .eq('city_id', city_id);
  
    if (fetchError) {
      console.error('Error checking existing records:', fetchError);
      return 0;
    }
  
    const recordCount = existingRecords?.length || 0;
    setimportedReccord(recordCount);
    return recordCount;
  }
  
  const fetchAdditionalData = async (productCode: string) => {
    try {
      const response = await fetch(`/api/viator/singleproducts/${productCode}`, {
        method: "GET",
        headers: {
          "Accept-Language": "en",
          "Content-Type": "application/json",
          "Accept": "application/json;version=2.0",
          "exp-api-key": apiKey,
        },
      });
      const data = await response.json();
      return {
        included: data.inclusions || "Not Provided",
        additional: data.additionalInfo || "Not Provided",
      };
    } catch (error) {
      console.error('Error fetching additional data:', error);
      return {
        included: "Not Provided",
        additional: "Not Provided",
      };
    }
  };

  const handleCollectRecords = async () => {
    const selectedOption = document.querySelector('#city option:checked');
    const vairtorId = selectedOption ? selectedOption.getAttribute('data-vaitor') || "5257" : "5257";
  
    const recordCount = await fetchTourCount((selectedOption as HTMLSelectElement)?.value || "");

    const new_start = recordCount + 1;
    setShowTable(true);
    const domain = window.location.origin;
    fetch(`${domain}/api/viator`, {
      method: "POST",
      headers: {
        "Accept-Language": "en",
        "Content-Type": "application/json",
        "Accept": "application/json;version=2.0",
        "exp-api-key": apiKey,
      },
      body: JSON.stringify({
        filtering: {
          destination: vairtorId,
        },
        pagination: {
          start: new_start,
          count: importLimit,
        },
        currency: "USD",
      }),
    })
      .then(response => response.json())
      .then(async data => {
        if (data && data.products) {
          settotalReccord(data.totalCount);
          if (data.totalCount === recordCount) {
            alert("All records already imported");
            setShowTable(false);
            return;
          }
          const updatedRecords = await Promise.all(data.products.map(async (product: any) => {
            const additionalData = await fetchAdditionalData(product.productCode);
            return {
              id: product.productCode,
              title: product.title,
              description: product.description,
              images: product.images,
              reviews: product.reviews,
              duration: product.duration,
              confirmationType: product.confirmationType,
              itineraryType: product.itineraryType,
              pricing: product.pricing,
              productUrl: product.productUrl,
              destinations: product.destinations,
              tags: product.tags,
              flags: product.flags,
              translationInfo: product.translationInfo,
              included: additionalData.included.map((item: { otherDescription: string }) => item.otherDescription).join(','),
              additional: additionalData.additional.map((item: { description: string }) => item.description).join(','),
              policy: product.policy || (product.flags && product.flags.length > 0 ? product.flags.join(', ') : "Not Provided"),
              rating: product.reviews?.combinedAverageRating 
                ? Number(product.reviews.combinedAverageRating.toFixed(2)) 
                : "Not Rated"
            };
          }));
          setRecords(updatedRecords);
        } else {
          console.error('Unexpected API response:', data);
        }
      })
      .catch(err => console.error('Error fetching records:', err));
  };

  const handleImport = async () => {
    const cityElement = document.querySelector('#city option:checked');
    const locationValue = cityElement ? (cityElement as HTMLSelectElement).value : '';
    try {
      const errors: string[] = [];
      for (const record of records) {
        const { data: existingRecords, error: fetchError } = await supabase
          .from('tours')
          .select('name')
          .eq('name', record.title);

        if (fetchError) {
          console.error('Error checking existing records:', fetchError);
          alert('Error checking existing records: ' + fetchError.message);
          continue;
        }

        if (existingRecords.length > 0) {
          console.log('Record with title already exists:', record.title);
          alert('Record with title already exists: ' + record.title);
          continue;
        }
        const { data, error: insertError } = await supabase
          .from('tours')
          .insert({
            name: record.title,
            description: record.description,
            tour_type_id: "aea70c34-f7d0-498d-91b3-2e7cb8ac3153",
            duration: "Full Day",
            city_id: locationValue,
            booking_link: record.productUrl,
            image_url: record.images && record.images.length > 0 ? record.images[0].variants[12].url : 'No Images',
            price: parseFloat(record.pricing.summary.fromPrice),
            included: record.included,
            additional: record.additional,
            policy: record.policy || (record.flags && record.flags.length > 0 ? record.flags.join(', ') : "Not Provided"),
            rating: record.reviews?.combinedAverageRating 
              ? Number(record.reviews.combinedAverageRating.toFixed(2)) 
              : "Not Rated"
          });

        if (insertError) {
          console.error('Error inserting data:', insertError);
          errors.push(insertError.message);
        } else {
          console.log('Data inserted successfully:', data);
        }
      }

      if (errors.length === 0) {
        console.log('All data inserted successfully');
        alert('Data inserted successfully!');
      } else {
        alert(`Some records failed to import: ${errors.join(', ')}`);
      }
    } catch (err) {
      console.error('Unexpected error during import:', err);
      alert('Unexpected error during import: ' + (err as Error).message);
    }
  };

  const handleReset = () => {
    setApiKey('77cb043f-4a94-4eed-85ff-fe246577e4ad');
    setLocation('');
    setImportLimit(10);
    setRecords([]);
  };

  return (
    <div className="importer">
      <h2>Import Data</h2>

      <div className="importer-row">
        <label>Location To</label>
        <select id="city" value={location} onChange={(e) => setLocation(e.target.value)}>
          {cities.map((city: City) => (
            <option key={city.id} value={city.id} data-vaitor={city.vaitorId}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="importer-row">
        <button onClick={handleCollectRecords}>Collect Records</button>
      </div>

      <div className="importer-info">
        <p>Total Records for this location: <strong>{totalReccord}</strong></p>
        <p>Imported Records: <strong>{importedReccord}</strong></p>
        <p>Ready to Import: <strong>0</strong></p>
      </div>

      <div className="importer-row">
        <label>Import Limit</label>
        <select value={importLimit} onChange={(e) => setImportLimit(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      <div className="importer-actions">
        <button onClick={handleImport}>Import</button>
        <button onClick={handleReset}>Reset</button>
      </div>

      {showTable && records.length > 0 && (
        <table className="importer-table">
          <thead>
            <tr>
              <th>Product Code</th>
              <th>Title</th>
              <th>Images</th>
              <th>Reviews</th>
              <th>Duration</th>
              <th>Confirmation Type</th>
              <th>Itinerary Type</th>
              <th>Pricing</th>
              <th>Product URL</th>
              <th>Destinations</th>
              <th>Tags</th>
              <th>Flags</th>
              <th>Translation Info</th>
              <th>Included</th>
              <th>Addition Info</th>
              <th>Policy</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record: any) => (
              <tr key={record.id}>
                <td>{record.id || 'N/A'}</td>
                <td>{record.title || 'N/A'}</td>
                <td>
                  {record.images && record.images.length > 0 ? record.images.map((image: any, index: number) => (
                    <span key={index}>{image.variants[0].url}</span>
                  )) : 'No Images'}
                </td>
                <td>
                  {record.reviews && record.reviews.sources.length > 0 ? record.reviews.sources.map((source: any, index: number) => (
                    <p key={index}>
                      {source.provider}: {source.totalCount} reviews, Average Rating: {source.averageRating}
                    </p>
                  )) : 'No Reviews'}
                  {record.reviews ? (
                    <p>Total Reviews: {record.reviews.totalReviews}, Combined Average Rating: {record.reviews.combinedAverageRating.toFixed(2)}</p>
                  ) : null}
                </td>
                <td>{record.duration ? `${record.duration.fixedDurationInMinutes} minutes` : 'N/A'}</td>
                <td>{record.confirmationType || 'N/A'}</td>
                <td>{record.itineraryType || 'N/A'}</td>
                <td>{record.pricing ? `From ${record.pricing.summary.fromPrice} ${record.pricing.currency}` : 'N/A'}</td>
                <td>{record.productUrl ? <a href={record.productUrl}>View Product</a> : 'N/A'}</td>
                <td>{record.destinations && record.destinations.length > 0 ? record.destinations.map((dest: any) => dest.ref).join(', ') : 'N/A'}</td>
                <td>{record.tags && record.tags.length > 0 ? record.tags.join(', ') : 'N/A'}</td>
                <td>{record.flags && record.flags.length > 0 ? record.flags.join(', ') : 'N/A'}</td>
                <td>{record.translationInfo ? record.translationInfo.translationSource : 'N/A'}</td>
                <td>{record.included ? record.included : 'N/A'}</td>
                <td>{record.additional  ? record.additional  : 'N/A'}</td>
                <td>{record.policy ? record.policy : 'N/A'}</td>
                <td>{record.rating ? record.rating : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Importer;
