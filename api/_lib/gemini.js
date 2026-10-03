const model = "gemini-2.5-flash";

export async function generateStructured(prompt, schema) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured.");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", responseJsonSchema: schema, temperature: 0.5 } }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error?.message || `Gemini request failed (${response.status}).`);
  const text = payload.candidates?.[0]?.content?.parts?.find((part) => part.text)?.text;
  if (!text) throw new Error("Gemini returned no structured output.");
  return { model, output: JSON.parse(text), providerResponseId: payload.responseId || "" };
}

