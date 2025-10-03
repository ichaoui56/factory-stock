import { WorkType } from "@prisma/client"

export function mapWorkTypeToFrontend(workType: WorkType): string {
  switch (workType) {
    case "LAFSOW_MAHDI":
      return "lafso-mahdi"
    case "ALFASALA":
      return "al-fasala"
    case "BOTH":
      return "both"
    default:
      return "lafso-mahdi"
  }
}

export function mapWorkTypeToDatabase(workType: string): WorkType {
  switch (workType) {
    case "lafso-mahdi":
      return "LAFSOW_MAHDI"
    case "al-fasala":
      return "ALFASALA"
    case "both":
      return "BOTH"
    default:
      return "LAFSOW_MAHDI"
  }
}
