import api from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await api.post("/auth/login", {
      username: body.username,
      password: body.password,
    });
    return Response.json({
      success: true,
      data: response.data,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.response?.data?.message || "Authentication failed",
      },
      { status: error.response?.status || 401 },
    );
  }
}
