// JavaScript version of the replication script
import { replicateTours } from './replicateTours.js';

// Run the replication process
async function run() {
  console.log('Starting tour replication process...');
  
  try {
    const result = await replicateTours();
    console.log('Replication result:', result);
  } catch (error) {
    console.error('Error during replication:', error);
  }
}

run();
