document.getElementById('saveBtn').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const model = document.getElementById('model').value;
    const targetLang = document.getElementById('targetLang').value.trim() || "en";
  
    chrome.storage.local.set({ openaiKey: apiKey, model: model, targetLang }, () => {
      alert("Settings saved successfully!");
    });
  });
  
  window.onload = () => {
    chrome.storage.local.get(['openaiKey', 'model', 'targetLang'], (data) => {
      if (data.openaiKey) document.getElementById('apiKey').value = data.openaiKey;
      if (data.model) document.getElementById('model').value = data.model;
      if (data.targetLang) document.getElementById('targetLang').value = data.targetLang;
    });
  };
  