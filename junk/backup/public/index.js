



// Code to handle install prompt on desktop

let deferredPrompt;


window.addEventListener('beforeinstallprompt', (e) => {
console.log('👍', 'beforeinstallprompt', e);
});