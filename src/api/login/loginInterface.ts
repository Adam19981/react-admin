import http from "@/utils/request";

export function getImages() {
	return http.get("/images");
}

export function login(req: Record<string, string>) {
	return http.post("/login", req, { headers: { "Content-Type": "multipart/form-data" } });
}
