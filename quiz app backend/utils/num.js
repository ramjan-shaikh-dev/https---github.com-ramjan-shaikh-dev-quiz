function randomGenerator() {
    return Math.floor(10000 + Math.random() * 90000);
}
const otp = randomGenerator(); 
console.log(otp)