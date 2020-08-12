(function(){
const imgContainer = document.querySelector('.banner');
const images = ["banner-1", "banner-2", "banner-3"]
let counter = 0

function changeImage(){

imgContainer.style.backgroundImage = `url('./imgs/${images[counter]}.jpg')`
counter++;
if(counter < 0){
    counter = images.length-1
}else if(counter > images.length-1){
    counter = 0
}
};
setInterval(changeImage, 2000)

})()
