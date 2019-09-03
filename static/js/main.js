let trainingToggle = document.querySelector(".train__button--play");
trainingToggle.addEventListener("click", () => toggleTraining());

let reset = document.querySelector(".train__button--reset");
reset.addEventListener("click", () => resetSketch());

let input1 = document.querySelector("#input1");
let input2 = document.querySelector("#input2");
let inputs = document.querySelector("#input-vec");
let submitBtn = document.querySelector(".train__submit");
console.log(submitBtn);
let output = document.querySelector(".train__output");

input1.addEventListener("input", (e) => { inputs.innerHTML = `Input Vector: [${e.target.value}, ${input2.value}]` });
input2.addEventListener("input", (e) => { inputs.innerHTML = `Input Vector: [${input1.value}, ${e.target.value}]` });

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (input1.value >= 0 && input1.value <= 1 && input2.value >= 0 && input2.value <= 1) output.innerHTML = `Output Vector (5 d.p): [${math.round(nn.guess([input1.value, input2.value]), 5)}]`;
    else output.innerHTML = "Please make both inputs between 0 and 1";
});
