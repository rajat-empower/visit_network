import { replicateTours } from './replicateTours.js';

// This function will be called when the script is imported
export async function runReplication() {
  console.log('Starting tour replication process...');
  
  try {
    const result = await replicateTours();
    console.log('Replication result:', result);
    return result;
  } catch (error) {
    console.error('Error during replication:', error);
    throw error;
  }
}

// Auto-run when imported
runReplication();
