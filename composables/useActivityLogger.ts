import { collection, addDoc, Timestamp } from "firebase/firestore"
import { useFirebase } from "~/composables/useFirebase"

export const useActivityLogger = () => {
  const { db } = useFirebase()

  const logActivity = async (
    type: string, // e.g., 'data_added', 'data_updated', 'clustering_run', 'report_generated', 'data_deleted', 'data_exported'
    title: string,
    message: string,
    category: "notification" | "activity" = "activity", // Default ke 'activity'
  ) => {
    try {
      await addDoc(collection(db, "dashboard_logs"), {
        timestamp: Timestamp.now(),
        type,
        title,
        message,
        category,
      })
      console.log(`Activity logged: ${title}`)
    } catch (error) {
      console.error("Error logging activity:", error)
    }
  }

  return {
    logActivity,
  }
}
