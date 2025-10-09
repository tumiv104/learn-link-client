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

export async function acceptMission(missionId: number) {
  const res = await api.post("/submission/accept", {missionId});
  return res.data;
}

export async function submitMission(missionId: number, fd: FormData) {
  const res = await api.post(`/submission/missions/${missionId}/submit`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
}

export async function approveSubmission(submissionId: number, score: number, feedback: string) {
  const res = await api.post("/submission/approve", {
    submissionId,
    score,
    feedback
  })
  return res.data
}

export async function rejectSubmission(submissionId: number, score: number, feedback: string) {
  const res = await api.post("/submission/reject", {
    submissionId,
    score,
    feedback
  })
  return res.data
}