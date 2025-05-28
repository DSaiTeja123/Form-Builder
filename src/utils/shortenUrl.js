// src/utils/shortenUrl.js
export async function shortenUrl(longUrl) {
  const response = await fetch(
    `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
  );
  if (!response.ok) throw new Error("Failed to shorten URL");
  return await response.text();
}
