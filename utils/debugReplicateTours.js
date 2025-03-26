import { replicateTours } from './replicateTours.js';

// Run the replication process with detailed error logging
async function run() {
  console.log('Starting tour replication process with detailed error logging...');
  
  try {
    const result = await replicateTours();
    console.log('Replication result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error during replication:', error);
    
    // Log more details about the error
    if (error.message) {
      console.error('Error message:', error.message);
    }
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    if (error.details) {
      console.error('Error details:', error.details);
    }
    
    if (error.hint) {
      console.error('Error hint:', error.hint);
    }
  }
}

// Run the function
run();
