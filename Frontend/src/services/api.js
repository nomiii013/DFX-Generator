// For future: you can centralize API calls here
const BASE_URL = "http://127.0.0.1:5000/api";

export const generateDXF = async (payload) => {
  const res = await fetch(`${BASE_URL}/dxf/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
};
