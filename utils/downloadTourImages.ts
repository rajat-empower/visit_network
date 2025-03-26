import fs from 'fs';
import path from 'path';
import https from 'https';

// Define the image URLs and their local file names
const imagesToDownload = [
  {
    url: 'https://images.unsplash.com/photo-1575999502951-4ab25b5ca889',
    filename: 'private-transfer-ljubljana-bled.jpg',
    description: 'Car interior view for private transfer'
  },
  {
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b',
    filename: 'broken-bones-gin-experience.jpg',
    description: 'Bartender making gin cocktail'
  },
  {
    url: 'https://images.unsplash.com/photo-1605101479435-006c41b653a3',
    filename: 'slovenian-alps-ebike-tour.jpg',
    description: 'E-bikes near mountain lake'
  },
  {
    url: 'https://images.unsplash.com/photo-1499678329028-101435549a4e',
    filename: 'best-of-slovenia-day-trip.jpg',
    description: 'Lake Bled aerial view'
  },
  {
    url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d',
    filename: 'bear-watching-slovenia.jpg',
    description: 'Brown bears in natural habitat'
  },
  {
    url: 'https://images.unsplash.com/photo-1601652589234-c282487ec2d9',
    filename: 'bled-lake-island-castle-trip.jpg',
    description: 'Lake Bled with island and castle'
  },
  {
    url: 'https://images.unsplash.com/photo-1555622885-3ebaa087a8e1',
    filename: 'skocjan-piran-predjama-trip.jpg',
    description: 'Aerial view of Piran coastal town'
  }
];

// Function to download an image
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file if there was an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Main function to download all images
export async function downloadTourImages() {
  const imagesDir = path.join(process.cwd(), 'public', 'images');
  
  // Create the images directory if it doesn't exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log('Downloading tour images...');
  
  try {
    // Download each image
    for (const image of imagesToDownload) {
      const filepath = path.join(imagesDir, image.filename);
      
      // Skip if the file already exists
      if (fs.existsSync(filepath)) {
        console.log(`File already exists: ${image.filename}`);
        continue;
      }
      
      await downloadImage(`${image.url}?auto=format&fit=crop&w=800&q=80`, filepath);
    }
    
    console.log('All images downloaded successfully!');
    return { success: true, message: 'All tour images downloaded successfully' };
  } catch (error) {
    console.error('Error downloading images:', error);
    return { success: false, message: 'Error downloading tour images', error };
  }
}
