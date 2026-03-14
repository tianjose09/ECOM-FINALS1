// Toggle password visibility
function togglePassword(inputId, iconId) {

const passwordInput = document.getElementById(inputId);
const toggleIcon = document.getElementById(iconId);

if(passwordInput.type === 'password'){
passwordInput.type = 'text';
toggleIcon.textContent = 'visibility';
}else{
passwordInput.type = 'password';
toggleIcon.textContent = 'visibility_off';
}

}

function showSuccessMessage(message, redirectUrl){

const successDiv = document.createElement('div');
successDiv.className = 'success-message';

successDiv.innerHTML = `
<span class="material-icons">check_circle</span>
<span class="message-text">${message}</span>
`;

document.body.appendChild(successDiv);

setTimeout(()=>{

successDiv.style.transition = 'opacity 0.3s ease';
successDiv.style.opacity = '0';

setTimeout(()=>{
successDiv.remove();
window.location.href = redirectUrl;
},300);

},2000);

}

document.addEventListener('DOMContentLoaded',function(){

const registerBtn=document.getElementById('registerBtn');
const emailInput=document.getElementById('email');
const passwordInput=document.getElementById('password');
const confirmInput=document.getElementById('confirmPassword');

registerBtn.addEventListener('click',function(e){

e.preventDefault();

const email=emailInput.value;
const password=passwordInput.value;
const confirm=confirmInput.value;

if(!email||!password||!confirm){
alert('Please fill in all fields');
return;
}

if(password!==confirm){
alert('Passwords do not match!');
return;
}

if(password.length<8){
alert('Password must be at least 8 characters long');
return;
}

showSuccessMessage('You registered successfully!','login.html');

});

const accountContainer=document.querySelector('.account-dropdown-container');
const dropdownMenu=document.querySelector('.dropdown-menu');

if(accountContainer){

accountContainer.addEventListener('click',(e)=>{

e.stopPropagation();
dropdownMenu.classList.toggle('show');
accountContainer.classList.toggle('show-logout');

let expanded=accountContainer.getAttribute('aria-expanded')==='true';
accountContainer.setAttribute('aria-expanded',!expanded);

});

document.addEventListener('click',(e)=>{

if(!accountContainer.contains(e.target)){

dropdownMenu.classList.remove('show');
accountContainer.classList.remove('show-logout');
accountContainer.setAttribute('aria-expanded',false);

}

});

}

});