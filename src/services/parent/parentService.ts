import api from "@/lib/api";
import { ChildBasicInfoDTO } from "@/data/ChildBasicInfoDTO";

export async function getChildren(){
  const res = await api.get("/Parent/children");
  return res.data.data as ChildBasicInfoDTO[];
}
