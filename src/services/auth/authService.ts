import api, { setAccessToken } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

export type UserDto = {
  email: string;
  name: string;
  role?: "Parent" | "Child" | "Admin";
};

type JwtPayload = {
  email: string; 
  name: string;
  role: string;
};

export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  const { accessToken } = res.data.data;
  setAccessToken(accessToken);

  const payload = jwtDecode<JwtPayload>(accessToken);
  console.log(payload);
  const user: UserDto = {
    email: payload.email,
    name: payload.name,
    role: payload.role as "Parent" | "Child" | "Admin" | undefined,
  };

  return { accessToken, user: user as UserDto };
}

export async function register(
  name: string,
  email: string,
  password: string,
  roleId: number,
  dob?: Date,
  avatarUrl?: string
) {
  const payload = {
    name,
    email,
    password,
    roleId,
    dob: dob ? dob.toISOString() : null, 
    avatarUrl: avatarUrl || null
  };
  const res = await api.post("/auth/register", payload);
  return res.data;
}

export async function refresh() {
  const res = await api.post("/auth/refresh", {}); 
  const { accessToken } = res.data.data;
  setAccessToken(accessToken);
  return accessToken;
}

export async function logout() {
  try {
    await api.post("/auth/logout", {}); 
  } finally {
    setAccessToken(null);
  }
}
