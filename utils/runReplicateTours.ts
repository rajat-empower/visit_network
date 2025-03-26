import { replicateTours } from './replicateTours';

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
