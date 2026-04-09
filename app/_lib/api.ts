// app/_lib/api.ts
export async function fetchPortfolio<T>(): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim().replace(/\/+$/, "");
  const url = baseUrl ? `${baseUrl}/api/portfolio` : undefined;

  if (!url) throw new Error("NEXT_PUBLIC_BASE_URL not defined in env");

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error: ${res.status} - ${errorText}`);
    }

    return (await res.json()) as T;
  } catch (err) {
    console.error("Portfolio fetch failed:", err);
    throw new Error("Failed to fetch portfolio data");
  }
}
