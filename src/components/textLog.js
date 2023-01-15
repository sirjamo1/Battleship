import digitalTyping from "../assets/sounds/digitalTyping.wav";
const digitalTypingSound = new Audio(digitalTyping);
const logTextToScreen = (message, audioOn) => {
    setTimeout(() => {
        let textBox = document.getElementById("log-text");
        textBox.innerHTML = "";
        if (audioOn) digitalTypingSound.play();
        let i = 0;
        const typeWriter = () => {
            if (i < message.length) {
                textBox.innerHTML += message.charAt(i);

                i++;
                setTimeout(typeWriter, 50);
            }
        };
        typeWriter();
    }, 500);
};

export {logTextToScreen}