chrome.runtime.onMessage.addListener((message)=> {
    console.log(message);
})
// chrome.runtime.sendMessage({ message: 'I made it!!!' });
window.alert("yay!")
console.log("Yaya")