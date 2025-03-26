"use server"

// Import all server-side functions
// import { setupTours } from "@/utils/setupTours"
import { addTours } from "@/utils/addTours"
import { downloadTourImages } from "@/utils/downloadTourImages"
import { replicateTours } from "@/utils/replicateTours"
// import { debugReplicateTours } from "@/utils/debugReplicateTours"
import { setupDatabase } from "@/utils/setupDatabase"
import { updateToursSchema } from "@/utils/updateToursSchema"
// Import other server-side functions as needed

// Re-export all functions
export {
  // setupTours,
  addTours,
  downloadTourImages,
  replicateTours,
//   debugReplicateTours,
  setupDatabase,
  updateToursSchema,
  // Export other functions as needed
}