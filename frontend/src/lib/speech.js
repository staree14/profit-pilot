export function speak(text) {
  if (!('speechSynthesis' in window) || !text) return
  window.speechSynthesis.cancel() // don't stack replies if one is already playing
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 1.0
  window.speechSynthesis.speak(utter)
}
