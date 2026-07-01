const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

let index = 0;
let intervalo;

function mostrarSlide(i){

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    slides[i].classList.add("active");
}

function siguiente(){

    index++;

    if(index >= slides.length){
        index = 0;
    }

    mostrarSlide(index);
}

function anterior(){

    index--;

    if(index < 0){
        index = slides.length - 1;
    }

    mostrarSlide(index);
}

next.addEventListener("click", ()=>{

    siguiente();
    reiniciarIntervalo();

});

prev.addEventListener("click", ()=>{

    anterior();
    reiniciarIntervalo();

});

function iniciarIntervalo(){

    intervalo = setInterval(()=>{
        siguiente();
    },3000);

}

function reiniciarIntervalo(){

    clearInterval(intervalo);
    iniciarIntervalo();

}

mostrarSlide(index);
iniciarIntervalo();