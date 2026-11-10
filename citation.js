(() => {
  const button = document.getElementById('copy-citation');
  const code = document.getElementById('citation-code');
  const status = document.getElementById('citation-status');
  if (!button || !code) return;
  let timer;
  button.addEventListener('click', async () => {
    clearTimeout(timer);
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = 'Copied!';
      status.textContent = 'BibTeX copied to clipboard.';
      timer = setTimeout(() => { button.textContent = 'Copy BibTeX'; status.textContent = ''; }, 2500);
    } catch {
      const range = document.createRange(); range.selectNodeContents(code);
      const selection = window.getSelection();selection.removeAllRanges();selection.addRange(range);
      status.textContent = 'Please copy the selected citation, or download the .bib file.';
    }
  });
})();
