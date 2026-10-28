import { NextRequest, NextResponse } from "next/server";

const rawBase = (process.env.BACKEND_API_URL || "http://187.6.167.239").replace(/\/+$/, "");
const API_BASE_URL = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  let cleanPath = (path || []).filter(Boolean).join("/");
  if (cleanPath.startsWith("api/")) {
    cleanPath = cleanPath.slice(4);
  }
  const search = request.nextUrl.search || "";
  const queryString = search ? (search.startsWith("?") ? search : `?${search}`) : "";
  const targetUrl = `${API_BASE_URL}/${cleanPath}/${queryString}`;


  const headers = new Headers();
  request.headers.forEach((value, key) => {
    // Avoid forwarding connection or content-length or unwanted hop-by-hop headers
    if (!["host", "connection", "content-length"].includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // If a custom Host header is configured, apply it
  if (process.env.BACKEND_HOST_HEADER) {
    headers.set("Host", process.env.BACKEND_HOST_HEADER);
  }

  const method = request.method;
  let body: BodyInit | null = null;
  if (!["GET", "HEAD"].includes(method)) {
    try {
      body = await request.arrayBuffer();
    } catch {
      body = null;
    }
  }

  try {
    const backendResponse = await fetch(targetUrl, {
      method,
      headers,
      body,
      redirect: "follow",
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    backendResponse.headers.forEach((value, key) => {
      // Pass along content-type, authorization, etc.
      if (!["content-encoding", "transfer-encoding"].includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    const responseBody = await backendResponse.arrayBuffer();

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json(
      { success: false, message: `Failed to connect to backend: ${message}` },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;

