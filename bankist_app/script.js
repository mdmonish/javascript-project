'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentUser,timer;

//Timer 

const startTimer = function(){
  //this function is created to start setinterval immediatily because there is one second delay
  const startTimerWithoutDelay = function(){
    //converting number into time
    const min = String(Math.trunc(time/60)).padStart(2,0);
    const second = String(time%60).padStart(2,0);

   //chnage ui
   labelTimer.textContent = `${min}:${second}`;
   //logout when time is zero
   if(time === 0){
     clearInterval(timer)
     
 labelWelcome.textContent = `Login to get stared`;
 containerApp.style.opacity = 0;

   }
// decrement
   time--

  }
  //set time for count down
  let time = 120;
 

  //change time each second
  startTimerWithoutDelay();
   const timer = setInterval(startTimerWithoutDelay,1000);
   return timer
}


//Function to display Transaction Movement

const priceFormatter = (locale,currency,price) =>{
  return new Intl.NumberFormat(locale,{style: "currency",currency:currency}).format(price)
}

const dateFormatter = (locale,date)=>{
const options = {
    day: 'numeric',
    year:'numeric',
    month: 'numeric'
  }

  return new Intl.DateTimeFormat(locale,options).format(date);
}

//displayTranscation History

const displayTransactionMovement = function(user,sort=false){
containerMovements.innerHTML = ''; //it will empty jte previous elements

const movs = sort? user.movements.slice().sort((a,b)=>a-b):user.movements;

movs.forEach(function(mov,i){
    const type = mov>0 ?"deposit" :"withdrawal"

    const date = new Date(user.movementsDates[i]);
    const displayDate = dateFormatter(user.locale,date)
    
    //using html template iwth the data 
    const html =`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${priceFormatter(user.locale,user.currency,mov)}</div>
  </div>`;

  containerMovements.insertAdjacentHTML('afterbegin',html)
})
}
 
//Function to calculate total balance

const displayMovementBalance = function(user){
  user.balance =  user.movements.reduce(function(acc,curr){ return acc+ curr},0)

 labelBalance.textContent = `${priceFormatter(user.locale,user.currency,user.balance)}`
 //date formatting
  const date = new Date();
  const options = {
    hour: 'numeric',
    minute: "numeric",
    day: 'numeric',
    year:'numeric',
    month: 'numeric'
  }
  
  
labelDate.textContent = new Intl.DateTimeFormat(user.locale,options).format(date);
}

// displayMovementBalance(account1.movements)

//Deposit , withdrawal summary and intrest

const calcSummaryMovement = function(user){

  const deposits = user.movements.filter(mov=>mov>0).reduce((acc,dpt)=>acc+dpt,0)
  console.log("price",priceFormatter(user.locale,user.currency,deposits));
  labelSumIn.textContent = priceFormatter(user.locale,user.currency,deposits)

  const withdrawn = user.movements.filter(mov=>mov<0).reduce((acc,dpt)=>acc+dpt,0)
  labelSumOut.textContent = priceFormatter(user.locale,user.currency,Math.abs(withdrawn.toFixed(2)))

  const intrest = user.movements.filter(mov=>mov>0).map(amt=> amt*user.interestRate/100).filter(val=>val>=1).reduce((acc,int)=>acc+int,0)
  labelSumInterest.textContent = priceFormatter(user.locale,user.currency,Math.abs(intrest.toFixed(2)))


};

// calcSummaryMovement(account1.movements)

//creating username
const users = function(accounts){
    //update accounts with complete details of accounts
    accounts.forEach(function(acc){
        acc.username = acc.owner.toLowerCase().split(" ").map((usr)=>usr[0]).join('');
    })

}

users(accounts);

const updateUi = function(acc){
//display movement
displayTransactionMovement(acc)
//display total
displayMovementBalance(acc)
//display summary
calcSummaryMovement(acc)
}

//Event handler


//login Check
btnLogin.addEventListener('click',function(e){
e.preventDefault();

currentUser = accounts.find((acc)=>acc.username === inputLoginUsername.value)

if(currentUser?.pin === Number(inputLoginPin.value)){
 
  //display ui login message
  labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`;
  containerApp.style.opacity = 100;
  //clear input fields
  inputLoginUsername.value = inputLoginPin.value ='';
  inputLoginPin.blur();
  inputLoginUsername.blur();
  if(timer)clearInterval(timer);
  timer =startTimer();
  updateUi(currentUser)
}
})

//transfer amount functionality
btnTransfer.addEventListener('click',function(e){
  e.preventDefault();

  const amount =Number( inputTransferAmount.value);
  const receiverAcc = accounts.find(acc=>acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value='';
  if(amount>0 && receiverAcc && receiverAcc?.username !== currentUser.username && currentUser.balance>=amount){
   currentUser.movements.push(-amount);
   receiverAcc.movements.push(amount);
    //adding date too
    currentUser.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
    timer =startTimer();
   updateUi(currentUser)
  }
});

//loan request functionality

btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value ='';
  if(amount>0 && currentUser.movements.some(dpt=> dpt> amount*0.1)){
    //loan approved after 2.5s
    setTimeout(function(){
    currentUser.movements.push(amount);
    currentUser.movementsDates.push(new Date().toISOString());
    clearInterval(timer);
  timer =startTimer();
    updateUi(currentUser)},2500)
  }
})

//close account
btnClose.addEventListener('click',function(e){
  e.preventDefault();

  if(inputCloseUsername.value === currentUser.username && Number(inputClosePin.value) === currentUser.pin ){
    const index = accounts.findIndex(acc=> acc.username === currentUser.username);
    if(index> -1)
    accounts.splice(index,1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputClosePin.value = inputCloseUsername.value ='';
})

//sorting ascending order 
let sorted=false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  displayTransactionMovement(currentUser,!sorted);
  sorted=!sorted
})


