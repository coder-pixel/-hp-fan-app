export function buildViralShareLine(
  score: number,
  total: number,
  quizTitle?: string,
): string {
  const line = `I scored ${score}/${total} — can you beat me?`;
  return quizTitle ? `${line} ${quizTitle}` : line;
}

export function buildWhatsAppUrl(text: string, url?: string): string {
  const body = url?.trim() ? `${text}\n${url}` : text;
  return `https://wa.me/?text=${encodeURIComponent(body)}`;
}

export function buildTwitterIntentUrl(text: string, url?: string): string {
  const u = new URL("https://twitter.com/intent/tweet");
  u.searchParams.set("text", url?.trim() ? `${text} ${url}` : text);
  return u.toString();
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export async function downloadNodeAsPng(
  node: HTMLElement,
  filename = "quiz-result.png",
): Promise<void> {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, {
    pixelRatio: 2,
    cacheBust: true,
  });
  const a = document.createElement("a");
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

export async function shareNative(
  data: { title?: string; text: string; url?: string },
): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch {
    return false;
  }
}
