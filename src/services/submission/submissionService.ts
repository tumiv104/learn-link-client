import api from "@/lib/api"
import type { SubmissionDetailDTO } from "@/data/submissionDetail"
import type { PageResult } from "@/data/pagination"

export async function getParentSubmissions(page = 1, pageSize = 5): Promise<PageResult<SubmissionDetailDTO>> {
  const res = await api.get(`/Submission/parents`, {
    params: { page, pageSize }
  })
  return res.data.data as PageResult<SubmissionDetailDTO>
}




export async function reviewSubmission(
  submissionId: number,
  feedback: string,
  score: number,
  approved: boolean,
): Promise<any> {
  const res = await api.post(`/Submission/review/${submissionId}`, {
    feedback,
    score,
    approved,
  })
  return res.data
}
