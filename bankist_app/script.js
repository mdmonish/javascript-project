'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayTransactionMovement = function(userTransactionMovement){
containerMovements.innerHTML = ''; //it will empty jte previous elements

userTransactionMovement.forEach(function(mov,i){
    const type = mov>0 ?"deposit" :"withdrawal"
    //using html template iwth the data 
    const html =`<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
  
    <div class="movements__value">${mov}€</div>
  </div>`;

  containerMovements.insertAdjacentHTML('afterbegin',html)
})
}
// displayTransactionMovement(account1.movements)

//calculate total balance

const displayMovementBalance = function(user){
  console.log(user)
  user.balance =  user.movements.reduce(function(acc,curr){ return acc+ curr},0)

 labelBalance.textContent = `${user.balance} EUR`
}
// displayMovementBalance(account1.movements)

//Deposit , withdrawal summary and intrest

const calcSummaryMovement = function(user){

  const deposits = user.movements.filter(mov=>mov>0).reduce((acc,dpt)=>acc+dpt,0)
  labelSumIn.textContent = `${deposits}€`

  const withdrawn = user.movements.filter(mov=>mov<0).reduce((acc,dpt)=>acc+dpt,0)
  labelSumOut.textContent = `${Math.abs(withdrawn)}€`

  const intrest = user.movements.filter(mov=>mov>0).map(amt=> amt*user.interestRate/100).filter(val=>val>=1).reduce((acc,int)=>acc+int,0)
  labelSumInterest.textContent = `${intrest}€`


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
displayTransactionMovement(acc.movements)
//display total
displayMovementBalance(acc)
//display summary
calcSummaryMovement(acc)
}

//Event handler
let currentUser
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
  updateUi(currentUser)
}
})

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();

  const amount =Number( inputTransferAmount.value);
  const receiverAcc = accounts.find(acc=>acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value='';
  if(amount>0 && receiverAcc && receiverAcc?.username !== currentUser.username && currentUser.balance>=amount){
   currentUser.movements.push(-amount);
   receiverAcc.movements.push(amount);
   updateUi(currentUser)
  }
})


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const findMax = movements.reduce((acc,cur)=>{if(acc<cur)return cur; else{ return acc}},0);

/////////////////////////////////////////////////