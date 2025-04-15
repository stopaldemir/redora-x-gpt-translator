console.log("🚀 Redora X - GPT Translate is active");

const observer = new MutationObserver(() => {
    const tweets = document.querySelectorAll('[data-testid="tweetText"]');
    console.log(`🔍 Found ${tweets.length} tweet(s).`);

    for (let tweet of tweets) {
        if (tweet.getAttribute("data-gpt-translated")) continue;

        const text = tweet.innerText;
        if (!text.trim()) continue;

        tweet.setAttribute("data-gpt-translated", "true");
        console.log("📄 Original:", text);

        chrome.storage.local.get(["openaiKey", "model", "targetLang"], async ({ openaiKey, model, targetLang }) => {
            if (!openaiKey || !targetLang) {
                console.warn("⚠️ API key or targetLang is missing.");
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
".
      `.trim();

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${openaiKey}`,
                    },
                    body: JSON.stringify({
                        model: model || "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt
                            },
                            {
                                role: "user",
                                content: text
                            }
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

                const translatedText = data?.choices?.[0]?.message?.content?.trim();
                console.log("✅ Translated:", translatedText);

                if (!translatedText) return;

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

            } catch (err) {
                console.error("💥 Exception:", err);
            }
        });

    }
});

observer.observe(document.body, { childList: true, subtree: true });
