export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

export interface ConversionResult {
  filename: string;
  success: boolean;
  markdown: string | null;
  error: string | null;
  char_count: number;
  duration_ms: number;
}

interface ConvertResponse {
  results: ConversionResult[];
}

/**
 * Send one or more files to the FastAPI backend and get back Markdown
 * for each one (or an error message if a particular file failed).
 */
export async function convertFiles(files: File[]): Promise<ConversionResult[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file, file.name));

  const response = await fetch(`${API_BASE}/api/convert`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Conversion request failed (${response.status}). ${text}`.trim());
  }

  const data: ConvertResponse = await response.json();
  return data.results;
}
