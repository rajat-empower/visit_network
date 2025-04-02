import { Request, Response } from 'express';
import { LocationsDAO } from '../dao/locations.dao';
import { ToursDAO } from '../dao/tours.dao';
import { successResponse, errorResponse } from '../utils/api-response';
import viatorAPI from '../integrations/viator';
import { logger } from '../utils/logger';
import { supabase } from '../config/supabase';  // Assuming supabase connection is configured here
import axios from 'axios';
import path from 'path';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || 'visitslovenia';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_BASE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

interface ImageVariant {
  width: number;
  height: number;
  url: string;
}

interface ImageObject {
  variants?: ImageVariant[];
}

interface Tour {
  id?: string;
  productCode?: string;
  cityName?: string;
  countryName?: string;
  response_data?: {
    productCode?: string;
    cityName?: string;
    countryName?: string;
    images?: Array<{
      url?: string;
      variants?: ImageVariant[];
    }>;
    [key: string]: any;
  };
  images?: any[];
  [key: string]: any;
}

export class ToursController {
  private locationsDao: LocationsDAO;
  private toursDao: ToursDAO;

  constructor() {
    this.locationsDao = new LocationsDAO();
    this.toursDao = new ToursDAO();
  }

  private async uploadImageToBunnyCDN(imageUrl: string, folder: string = '/uploads/tours'): Promise<string> {
    try {
      // Generate a unique filename using timestamp and random string
    //   const timestamp = Date.now();
    //   const randomString = Math.random().toString(36).substring(7);
    //   const extension = path.extname(imageUrl) || '.jpg';
    //   const fileName = `${timestamp}_${randomString}${extension}`;
    //   const bunnyUploadUrl = `${BUNNY_BASE_URL}/${folder}/${fileName}`;

      const originalFileName = path.basename(imageUrl);
      const extension = path.extname(imageUrl) || '.jpg';
      const timestamp = Date.now();
      const fileName = `${timestamp}_${originalFileName}`;
      const bunnyUploadUrl = `${BUNNY_BASE_URL}/${folder}/${fileName}`;

      // Download image from source
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');

      // Upload to BunnyCDN
      await axios.put(bunnyUploadUrl, imageBuffer, {
        headers: {
          'AccessKey': BUNNY_API_KEY,
          'Content-Type': 'application/octet-stream',
        },
      });

      // Return the CDN URL
      return `https://${BUNNY_STORAGE_ZONE}.b-cdn.net/${folder}/${fileName}`;
    } catch (error) {
      logger.error('Error uploading image to BunnyCDN:', error);
      throw new Error('Failed to upload image to BunnyCDN');
    }
  }

  verifyLocations = async (req: Request, res: Response) => {
    try {
      const { locations } = req.body;
      if (!locations || !Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json(
          errorResponse('Please provide valid locations array', 400)
        );
      }

      // Filter out any empty or null locationIds
      const validLocations = locations.filter(locationId => locationId);

      // Verify only valid selected locations exist in Viator API
      const matches: Record<string, any> = {};
      for (const locationId of validLocations) {
        try {
          // Test fetch one tour to verify location exists
          const tours = await viatorAPI.getToursByCity({
            destinationId: locationId,
            limit: 1
          });
          matches[locationId] = tours[0] || null;
        } catch (error) {
          logger.error(`Failed to verify location ${locationId}:`, error);
          matches[locationId] = null;
        }
      }

      return res.status(200).json(
        successResponse(
          { matches },
          'Locations verified successfully',
          200
        )
      );
    } catch (error) {
      logger.error('Error verifying locations:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to verify locations',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  previewTours = async (req: Request, res: Response) => {
    try {
      const { locations, limit, page = 1 } = req.body;
  
      if (!locations || !Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json(
          errorResponse('Please provide a valid locations array', 400)
        );
      }

      const pageSize = limit || 100; // Default to 100 if no limit provided
  
      try {
        // Fetch city and country details from Supabase before fetching tours
        const { data: citiesData, error } = await supabase
          .from('cities') // Assuming 'cities' is your table name
          .select('id, destination_id, destination_name, parent_id') // Select the fields for city and country
          .in('destination_id', locations); // Fetch cities matching the provided destination IDs
  
        if (error) {
          logger.error('Error fetching cities from Supabase:', error);
          return res.status(500).json(
            errorResponse('Failed to fetch cities data', 500)
          );
        }
  
        // Map city and country info for quick lookup by destination_id
        const cityMap: Record<number, { cityName: string, countryName: string }> = {};
        citiesData?.forEach((city: any) => {
          cityMap[city.destination_id] = {
            cityName: city.destination_name,  // City name
            countryName: city.parent_id || '', // Parent ID could represent country or similar
          };
        });
  
        // Fetch tours for each location with their own pagination
        const locationResults = await Promise.all(locations.map(async (locationId) => {
          try {
            // Get initial response to get totalCount
            const response = await viatorAPI.getToursByCity({
              destinationId: locationId,            
              limit: pageSize,
              page: page
            });
  
            // Get the total count from the response
            const totalCount = response?.length > 0 ? parseInt(response[0].totalCount, 10) : 0;
  
            // Calculate total pages using totalCount and pageSize
            const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
            
            // Map the tours with city and country info from cityMap
            const tours = Array.isArray(response) ? response.map((tour: any) => {
              const cityInfo = cityMap[tour.destinationId];  // Fetch city and country info from cityMap
  
              return {
                ...tour,
                location: {
                  city: cityInfo?.cityName || tour.cityName || '', // City name from cityMap or fallback
                  country: cityInfo?.countryName || '', // Country name from cityMap or fallback
                  iataCode: tour.cityId || '',
                  timeZone: ''
                },
                productCode: tour.productCode || tour.id,
                productUrl: tour.bookingLink || tour.productUrl || ''
              };
            }) : [];
  
            return {
              locationId,
              tours,
              pagination: {
                totalCount,
                currentPage: page,
                totalPages,
                hasMore: page < totalPages,
                pageSize
              }
            };
          } catch (error) {
            logger.error(`Failed to fetch tours for location ${locationId}:`, error);
            return {
              locationId,
              tours: [],
              pagination: {
                totalCount: 0,
                currentPage: page,
                totalPages: 1,
                hasMore: false,
                pageSize
              }
            };
          }
        }));
  
        // Calculate overall totals
        const overallTotal = locationResults.reduce((sum, location) => sum + location.pagination.totalCount, 0);
        const maxTotalPages = Math.max(1, Math.max(...locationResults.map(loc => loc.pagination.totalPages)));
  
        return res.status(200).json(
          successResponse(
            {
              locations: locationResults,
              overall: {
                totalCount: overallTotal,
                currentPage: page,
                totalPages: maxTotalPages,
                hasMore: page < maxTotalPages,
                pageSize
              }
            },
            'Tours preview fetched successfully',
            200
          )
        );
      } catch (error) {
        logger.error(`Failed to fetch tours: ${error}`);
        throw error;
      }
    } catch (error) {
      logger.error('Error fetching tours preview:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to fetch tours preview',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };
  
  importTour = async (req: Request, res: Response) => {
    try {
      // Set headers for streaming response
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Transfer-Encoding', 'chunked');

      const { category, source, selectedLocations, limit, pages } = req.body;

      if (!selectedLocations || !Array.isArray(selectedLocations) || selectedLocations.length === 0) {
        res.write(JSON.stringify({
          type: 'toast',
          message: 'Invalid Request',
          description: 'Please provide valid locations array',
          status: 'error'
        }) + '\n');
        return res.end();
      }

      const batchId = Date.now().toString();
      let totalImported = 0;
      let totalFailed = 0;
      let totalSkipped = 0;

      // Process each city
      for (const cityId of selectedLocations) {
        try {
          const currentPage = pages?.[cityId] || 1;

          // Starting import notification
          res.write(JSON.stringify({
            type: 'toast',
            message: `Starting import for city ${cityId}`,
            description: `Processing page ${currentPage}`,
            status: 'info'
          }) + '\n');

          const tours = await viatorAPI.getToursByCity({
            destinationId: cityId,
            limit: limit || 100,
            page: currentPage
          });

          // Tours found notification
          res.write(JSON.stringify({
            type: 'toast',
            message: `Found ${tours.length} tours`,
            description: `For city ${cityId}`,
            status: 'success'
          }) + '\n');

          for (const tour of tours as unknown as Tour[]) {
            let productCode = '';
            try {
              productCode = tour.response_data?.productCode || tour.productCode || '';
              
              if (!productCode) {
                res.write(JSON.stringify({
                  type: 'toast',
                  message: 'Missing Product Code',
                  description: `No product code found for tour in city ${cityId}`,
                  status: 'error'
                }) + '\n');
                totalFailed++;
                continue;
              }

              const { data: existingTour, error: checkError } = await supabase
                .from('data_import')
                .select('id')
                .eq('product_code', productCode)
                .single();

              if (checkError && checkError.code !== 'PGRST116') {
                res.write(JSON.stringify({
                  type: 'toast',
                  message: 'Database Error',
                  description: `Error checking existing tour ${productCode}`,
                  status: 'error'
                }) + '\n');
                totalFailed++;
                continue;
              }

              if (existingTour) {
                res.write(JSON.stringify({
                  type: 'toast',
                  message: 'Tour Exists',
                  description: `Tour ${productCode} already exists, skipping...`,
                  status: 'warning'
                }) + '\n');
                totalSkipped++;
                continue;
              }

              let uploadedImages = [];
              const tourImages = tour.response_data?.images || [];
              const maxImages = 5;

              res.write(JSON.stringify({
                type: 'toast',
                message: 'Processing Images',
                description: `Processing images for tour ${productCode}`,
                status: 'info'
              }) + '\n');

              // Process each image object
              for (const imageObj of tourImages) {
                if (!imageObj.variants || !Array.isArray(imageObj.variants)) continue;

                // Sort variants by resolution (width * height) in descending order
                const sortedVariants = [...imageObj.variants].sort((a, b) => 
                  (b.width * b.height) - (a.width * a.height)
                );

                // Take only the top 5 highest resolution variants
                const topVariants = sortedVariants.slice(0, maxImages);

                // Upload each of the top variants
                for (let i = 0; i < topVariants.length && uploadedImages.length < maxImages; i++) {
                  const variant = topVariants[i];
                  try {
                    if (variant.url) {
                      res.write(JSON.stringify({
                        type: 'toast',
                        message: 'Uploading Image',
                        description: `Uploading image ${uploadedImages.length + 1}/${maxImages} (${variant.width}x${variant.height}) for tour ${productCode}`,
                        status: 'info'
                      }) + '\n');

                      const uploadedUrl = await this.uploadImageToBunnyCDN(variant.url);
                      if (uploadedUrl) {
                        uploadedImages.push({
                          original_url: variant.url,
                          uploaded_url: uploadedUrl,
                          width: variant.width,
                          height: variant.height,
                          upload_timestamp: new Date().toISOString()
                        });
                      }
                    }
                  } catch (error) {
                    res.write(JSON.stringify({
                      type: 'toast',
                      message: 'Image Upload Failed',
                      description: `Failed to upload image ${uploadedImages.length + 1} for tour ${productCode}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                      status: 'error'
                    }) + '\n');
                  }

                  // Break if we've reached the maximum number of images
                  if (uploadedImages.length >= maxImages) break;
                }

                // Break the outer loop if we've reached the maximum number of images
                if (uploadedImages.length >= maxImages) break;
              }

              res.write(JSON.stringify({
                type: 'toast',
                message: 'Image Processing Complete',
                description: `Successfully processed ${uploadedImages.length} highest resolution images for tour ${productCode}`,
                status: 'success'
              }) + '\n');

              const importData = {
                source: source || 'VIATOR_API',
                category: category || 'TOURS',
                import_batch_id: batchId,
                response_data: tour.response_data || null,
                original_payload: tour.response_data || null,
                uploaded_images: uploadedImages,
                status: 'PROCESSING',
                metadata: {
                  import_timestamp: new Date().toISOString(),
                  city_id: cityId,
                  city_name: tour.cityName || tour.response_data?.cityName || '',
                  country_name: tour.countryName || tour.response_data?.countryName || '',
                  page: currentPage
                },
                processed_data: {}, // Initialize empty processed_data
                selected_locations: selectedLocations,
                import_limit: limit,
                product_code: productCode,
                title: tour.response_data?.title || '',
                description: tour.response_data?.description || '',
                country: tour.response_data?.countryId || tour.countryId || '',
                city: tour.response_data?.cityId || tour.cityId || '',
                total_count: tour.response_data?.totalCount || tour.totalCount || '0',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };

              // First, check if tour type exists
              const { data: existingTourType, error: checkTourTypeError } = await supabase
                .from('tour_types')
                .select('id')
                .eq('name', tour.response_data?.title || '')
                .single();

              if (checkTourTypeError && checkTourTypeError.code !== 'PGRST116') {
                throw new Error(`Error checking existing tour type: ${checkTourTypeError.message}`);
              }

              let tourTypeId;
              if (existingTourType) {
                // Update existing tour type
                const { data: updatedTourType, error: updateTourTypeError } = await supabase
                  .from('tour_types')
                  .update({
                    name: tour.response_data?.title || '',
                    description: tour.response_data?.description || '',
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', existingTourType.id)
                  .select('id')
                  .single();

                if (updateTourTypeError) {
                  throw new Error(`Failed to update tour type: ${updateTourTypeError.message}`);
                }
                tourTypeId = existingTourType.id;
              } else {
                // Insert new tour type
                const { data: newTourType, error: tourTypeError } = await supabase
                  .from('tour_types')
                  .insert([{
                    name: tour.response_data?.title || '',
                    description: tour.response_data?.description || '',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }])
                  .select('id')
                  .single();

                if (tourTypeError) {
                  throw new Error(`Failed to create tour type: ${tourTypeError.message}`);
                }
                tourTypeId = newTourType.id;
              }

              // Get city_id from cities table
              const { data: cityData, error: cityError } = await supabase
                .from('cities')
                .select('id')
                .eq('destination_id', cityId)
                .single();

              if (cityError) {
                throw new Error(`Failed to find city: ${cityError.message}`);
              }

              // Check if tour exists (rename to avoid redeclaration)
              const { data: existingTourRecord, error: checkTourError } = await supabase
                .from('tours')
                .select('id')
                .eq('name', tour.response_data?.title || '')
                .eq('city_id', cityData.id)
                .single();

              if (checkTourError && checkTourError.code !== 'PGRST116') {
                throw new Error(`Error checking existing tour: ${checkTourError.message}`);
              }

              let tourData;
              if (existingTourRecord?.id) {
                // Update existing tour
                const tourUpdateData = this.cleanObject({
                  name: tour.response_data?.title,
                  description: tour.response_data?.description,
                  city_id: cityData.id,
                  tour_type_id: tourTypeId,
                  duration: this.formatDuration({
                    from: tour.response_data?.duration?.variableDurationFromMinutes,
                    to: tour.response_data?.duration?.variableDurationToMinutes
                  }),
                  price: tour.response_data?.pricing?.summary?.fromPrice || tour.response_data?.price?.amount,
                  booking_link: tour.response_data?.productUrl || tour.response_data?.bookingLink,
                  image_url: uploadedImages.length > 0 ? uploadedImages[0].uploaded_url || uploadedImages[0].original_url : '',
                  included: tour.response_data?.inclusions?.filter(Boolean).join('\n'),
                  additional: tour.response_data?.additionalInfo?.filter(Boolean).join('\n'),
                  policy: tour.response_data?.flags?.filter(Boolean).join(', '),
                  rating: tour.response_data?.reviews?.combinedAverageRating || 0,
                  updated_at: new Date().toISOString()
                });

                const { data: updatedTour, error: updateTourError } = await supabase
                  .from('tours')
                  .update(tourUpdateData)
                  .eq('id', existingTourRecord.id)
                  .select('*')
                  .single();

                if (updateTourError) {
                  throw new Error(`Failed to update tour: ${updateTourError.message}`);
                }
                tourData = updatedTour;
              } else {
                // Insert new tour
                const tourInsertData = this.cleanObject({
                  name: tour.response_data?.title,
                  description: tour.response_data?.description,
                  city_id: cityData.id,
                  tour_type_id: tourTypeId,
                  duration: this.formatDuration({
                    from: tour.response_data?.duration?.variableDurationFromMinutes,
                    to: tour.response_data?.duration?.variableDurationToMinutes
                  }),
                  price: tour.response_data?.pricing?.summary?.fromPrice || tour.response_data?.price?.amount,
                  booking_link: tour.response_data?.productUrl || tour.response_data?.bookingLink,
                  image_url: uploadedImages.length > 0 ? uploadedImages[0].uploaded_url || uploadedImages[0].original_url : '',
                  is_featured: false,
                  included: tour.response_data?.inclusions?.filter(Boolean).join('\n'),
                  additional: tour.response_data?.additionalInfo?.filter(Boolean).join('\n'),
                  policy: tour.response_data?.flags?.filter(Boolean).join(', '),
                  rating: tour.response_data?.reviews?.combinedAverageRating || 0,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                });

                const { data: newTour, error: tourError } = await supabase
                  .from('tours')
                  .insert([tourInsertData])
                  .select('*')
                  .single();

                if (tourError) {
                  throw new Error(`Failed to create tour: ${tourError.message}`);
                }
                tourData = newTour;
              }

              // Log the importData before inserting
              const { data: insertedData, error: importError } = await supabase
                .from('data_import')
                .insert([{
                  ...importData,
                  processed_data: {
                    ...importData.processed_data,
                    tour_type_id: tourTypeId,
                    tour_id: tourData.id
                  }
                }])
                .select('*')
                .single();

              if (importError) {
                console.error('Database insert error:', importError);
                res.write(JSON.stringify({
                  type: 'toast',
                  message: 'Import Failed',
                  description: `Failed to store import data for tour ${productCode}: ${importError.message}`,
                  status: 'error'
                }) + '\n');
                totalFailed++;
                continue;
              }

              res.write(JSON.stringify({
                type: 'toast',
                message: 'Data Stored',
                description: `Successfully stored data for tour ${productCode}`,
                status: 'success'
              }) + '\n');

              const { error: updateError } = await supabase
                .from('data_import')
                .update({
                  status: 'COMPLETED',
                  processed_data: {
                    ...insertedData.processed_data,
                    tour_type: tourTypeId,
                    tour: tourData
                  },
                  updated_at: new Date().toISOString()
                })
                .eq('import_batch_id', batchId)
                .eq('product_code', productCode);

              if (updateError) {
                res.write(JSON.stringify({
                  type: 'toast',
                  message: 'Update Failed',
                  description: `Failed to update import status for tour ${productCode}`,
                  status: 'error'
                }) + '\n');
                totalFailed++;
              } else {
                totalImported++;
                res.write(JSON.stringify({
                  type: 'toast',
                  message: 'Tour Imported',
                  description: `Successfully imported tour ${productCode}`,
                  status: 'success'
                }) + '\n');
              }

            } catch (error) {
              totalFailed++;
              res.write(JSON.stringify({
                type: 'toast',
                message: 'Processing Failed',
                description: `Failed to process tour ${productCode}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                status: 'error'
              }) + '\n');
              
              await supabase
                .from('data_import')
                .update({
                  status: 'FAILED',
                  error_message: error instanceof Error ? error.message : 'Unknown error',
                  updated_at: new Date().toISOString()
                })
                .eq('import_batch_id', batchId)
                .eq('product_code', productCode);
            }
          }

          res.write(JSON.stringify({
            type: 'toast',
            message: 'City Processing Complete',
            description: `Completed processing city ${cityId}: ${totalImported} imported, ${totalSkipped} skipped, ${totalFailed} failed`,
            status: 'info'
          }) + '\n');

        } catch (error) {
          res.write(JSON.stringify({
            type: 'toast',
            message: 'City Processing Failed',
            description: `Failed to fetch tours for city ${cityId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            status: 'error'
          }) + '\n');
          totalFailed++;
        }
      }

      const summary = {
        batchId,
        imported: totalImported,
        failed: totalFailed,
        skipped: totalSkipped,
        total: totalImported + totalFailed + totalSkipped
      };

      // Final summary toast
      res.write(JSON.stringify({
        type: 'toast',
        message: 'Import Complete',
        description: `Successfully imported: ${totalImported}, Skipped: ${totalSkipped}, Failed: ${totalFailed}, Total: ${summary.total}`,
        status: 'success'
      }) + '\n');

      // Send the final summary as a special message type
      res.write(JSON.stringify({
        type: 'summary',
        data: summary,
        message: `Import completed with the following results:
           - Successfully imported: ${totalImported} tours
           - Skipped (already exist): ${totalSkipped} tours
           - Failed to import: ${totalFailed} tours
           - Total processed: ${totalImported + totalFailed + totalSkipped} tours`,
        status: 'success'
      }) + '\n');

      // End the response stream
      return res.end();

    } catch (error) {
      res.write(JSON.stringify({
        type: 'toast',
        message: 'Import Process Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error'
      }) + '\n');

      // Send error summary and end the stream
      res.write(JSON.stringify({
        type: 'summary',
        status: 'error',
        message: 'Import process failed with error: ' + (error instanceof Error ? error.message : 'Unknown error'),
        error: error instanceof Error ? error.message : 'Unknown error'
      }) + '\n');

      return res.end();
    }
  };

  resetTours = async (req: Request, res: Response) => {
    try {
      await this.toursDao.deleteAllTours();
      return res.status(200).json(
        successResponse(
          null,
          'All tours have been deleted successfully',
          200
        )
      );
    } catch (error) {
      logger.error('Error resetting tours:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to reset tours',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  createTour = async (req: Request, res: Response) => {
    try {
      const tourData = req.body;

      if (!tourData) {
        return res.status(400).json(
          errorResponse('Please provide tour data', 400)
        );
      }

      // Generate a unique batch ID if not provided
      const batchId = tourData.import_metadata?.import_batch_id || Date.now().toString();

      // First, store the original data in data_import table
      const importData = {
        source: tourData.import_metadata.source,
        category: tourData.import_metadata.category,
        import_batch_id: batchId,
        original_payload: tourData.import_metadata.original_payload,
        processed_data: tourData,
        status: 'PROCESSING',
        metadata: {
          import_timestamp: tourData.import_metadata.imported_at,
          city_id: tourData.city_id,
          city_name: tourData.city_name,
          country_name: tourData.country_name
        },
        selected_locations: tourData.import_metadata.selected_locations,
        import_limit: tourData.import_metadata.import_limit
      };

      // Insert into data_import table
      const { error: importError } = await supabase
        .from('data_import')
        .insert([importData]);

      if (importError) {
        logger.error('Error storing import data:', importError);
        throw importError;
      }

      try {
        // Upload images to BunnyCDN if present
        if (tourData.images && Array.isArray(tourData.images)) {
          const uploadedImages = await Promise.all(
            tourData.images.map(async (imageUrl: string) => {
              try {
                return await this.uploadImageToBunnyCDN(imageUrl);
              } catch (error) {
                logger.error(`Failed to upload image ${imageUrl}:`, error);
                return null;
              }
            })
          );

          // Filter out any failed uploads
          tourData.images = uploadedImages.filter(url => url !== null);
        }

        // Insert tour data into tours table
        const { data: tourResult, error: tourError } = await supabase
          .from('tours')
          .insert([tourData])
          .select()
          .single();

        if (tourError) {
          throw tourError;
        }

        // Update data_import status to COMPLETED
        const { error: updateError } = await supabase
          .from('data_import')
          .update({ 
            status: 'COMPLETED',
            processed_data: tourResult,
            updated_at: new Date().toISOString()
          })
          .eq('import_batch_id', batchId)
          .eq('original_payload->productCode', tourData.viator_id);

        if (updateError) {
          logger.error('Error updating import status:', updateError);
        }

        return res.status(200).json(
          successResponse(
            tourResult,
            'Tour created successfully',
            200
          )
        );
      } catch (error) {
        // Update data_import status to FAILED
        const { error: updateError } = await supabase
          .from('data_import')
          .update({ 
            status: 'FAILED',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            updated_at: new Date().toISOString()
          })
          .eq('import_batch_id', batchId)
          .eq('original_payload->productCode', tourData.viator_id);

        if (updateError) {
          logger.error('Error updating import status:', updateError);
        }

        throw error;
      }
    } catch (error) {
      logger.error('Error creating tour:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to create tour',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  getImportedData = async (req: Request, res: Response) => {
    try {
      const { data: importedData, error } = await supabase
        .from('data_import')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching imported data:', error);
        return res.status(500).json(
          errorResponse(
            'Failed to fetch imported data',
            500,
            error.message
          )
        );
      }

      return res.status(200).json(
        successResponse(
          importedData,
          'Imported data fetched successfully',
          200
        )
      );
    } catch (error) {
      logger.error('Error fetching imported data:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to fetch imported data',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  private formatDuration(minutes: { from?: number; to?: number } | string): string {
    if (typeof minutes === 'string') return minutes;

    const from = minutes.from || 0;
    const to = minutes.to || from;

    if (from === 0 && to === 0) return '';

    // Convert minutes to appropriate format
    if (from >= 1440 || to >= 1440) { // More than 24 hours
      const days = Math.ceil(to / 1440);
      return `${days} ${days === 1 ? 'Day' : 'Days'}`;
    } else if (from >= 360) { // 6 hours or more
      return 'Full Day';
    } else if (from >= 240) { // 4 hours or more
      return 'Half Day';
    } else if (from === to) {
      const hours = Math.floor(from / 60);
      const mins = from % 60;
      if (hours > 0) {
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
      }
      return `${mins}m`;
    } else {
      const fromHours = Math.floor(from / 60);
      const fromMins = from % 60;
      const toHours = Math.floor(to / 60);
      const toMins = to % 60;
      
      let duration = '';
      if (fromHours > 0) {
        duration += `${fromHours}-${toHours}h`;
        if (fromMins > 0 || toMins > 0) {
          duration += ` ${fromMins}-${toMins}m`;
        }
      } else {
        duration += `${fromMins}-${toMins}m`;
      }
      return duration;
    }
  }

  private cleanObject(obj: any): any {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
} 