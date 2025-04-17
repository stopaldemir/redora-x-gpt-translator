console.log("🚀 Redora X - GPT Translate is active");

const translationCache = new Map();
setInterval(() => {
  const now = Date.now();
  for (const [key, { ts }] of translationCache) {
    if (now - ts > 5 * 60 * 1000) translationCache.delete(key);
  }
}, 60 * 1000);

function renderTranslation(translatedText, tweet) {
  const translationDiv = document.createElement("div");
  translationDiv.style.marginTop = "8px";
  translationDiv.style.padding = "10px";
  translationDiv.style.background = "#1e1e1e";
  translationDiv.style.border = "1px solid #333";
  translationDiv.style.borderRadius = "6px";
  translationDiv.style.color = "#eee";
  translationDiv.style.fontSize = "14px";
  translationDiv.style.fontFamily = "sans-serif";
  translationDiv.innerText = `🌐 ${translatedText}`;
  tweet.parentElement.appendChild(translationDiv);
}

const observer = new MutationObserver(() => {
  const tweets = document.querySelectorAll('[data-testid="tweetText"]');
  console.log(`🔍 Found ${tweets.length} tweet(s).`);

  for (const tweet of tweets) {
    if (tweet.getAttribute("data-gpt-translated")) continue;
    const text = tweet.innerText.trim();
    if (!text) continue;
    tweet.setAttribute("data-gpt-translated", "true");
    console.log("📄 Original:", text);

    chrome.storage.local.get(["openaiKey", "model", "targetLang"], async ({ openaiKey, model, targetLang }) => {
      if (!openaiKey || !targetLang) {
        console.warn("⚠️ Missing openaiKey or targetLang");
        return;
      }

      try {
        if (translationCache.has(text)) {
          const { translatedText } = translationCache.get(text);
          renderTranslation(translatedText, tweet);
          return;
        }

        const systemPrompt = `
You are a translation engine, not an assistant. Your job is to always translate the input text into the target language: '${targetLang}' — regardless of the source language.

You must always return a translated version — even if the input is already in the target language.

After generating the translation, compare it to the input:
- If they are **visually identical** (after normalization, punctuation, spacing, etc.), return:
"This appears to already be in '${targetLang}'. Skipping translation."

Otherwise, return only the final translated version — short, natural, and fluent. Do NOT explain anything. Do NOT identify languages. Do NOT add any prefix, suffix, or meta information.

Strictly follow this pattern every time.
`.trim();

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: model || "gpt-3.5-turbo",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: text }
            ],
            temperature: 0.3,
            max_tokens: 200
          }),
        });

        const data = await response.json();
        if (data.error) {
          console.error("❌ API Error:", data.error.message);
          return;
        }

        const translatedText = data.choices[0].message.content.trim();

        translationCache.set(text, { translatedText, ts: Date.now() });

        console.log("✅ Translated:", translatedText);
        renderTranslation(translatedText, tweet);

        fetch("https://x.redora.co/api/dataset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source_text: text,
            translated_text: translatedText,
            timestamp: new Date().toISOString(),
            language: `→ ${targetLang}`,
            model: model || "gpt-3.5-turbo"
          })
        }).catch(err => console.warn("Dataset POST err:", err));

      } catch (err) {
        console.error("💥 Exception:", err);
      }
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });
