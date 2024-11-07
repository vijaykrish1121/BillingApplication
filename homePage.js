// document.getElementById('srch').addEventListener('keyup',findValue());
let values=[];
let selectedProducts=[];
let details=[];
let filteredData=[];
let total=0;
let gstAmount=0;
let finalAmount=0;
 const url='https://retoolapi.dev/ZSO4od/data'
function fetchData(){
   let user=localStorage.getItem('user')
  console.log(user);
  if(user!='' && user!=null){
  fetch(`${url}?user=${user}`,{
    method:'GET',
    headers: {
        'Content-Type': 'application/json',
      }
  }).then(response => response.json())
  .then(data=>{  
    values=data 
       values.sort((a,b) => a.productName.toLowerCase().localeCompare(b.productName.toLowerCase()));
    
  let resultsList=''
  let quantity=Number(document.getElementById('choosedQuantity')); 
  console.log(quantity);
    values.forEach((res) => {         
    // resultsList +='<div class="row mt-4">' +
    // '<div class="col-3">' +'<ul>'+'<li>'+value.productName+'</li>'+'</ul>'+ '</div>'+ '<div class="col-2">'+ '<input type="number" class="form-control" value=1>'+'</div>'+ '<div class="col-2">'+'<button type="button" class="btn btn-success">'+'add'+'</button>'+'</div>'+'</div>';
    resultsList+='<tr>'+
    '<td id="name-' + res.id + '">'+res.productName+'</td>'+
    '<td id="price-' + res.id + '">₹' + res.price + '</td>' +
    '<td><input type="number" class="input-sm" value="1" id="choosedQuantity-' + res.id + '" min="1" onkeyup="updatePrice(' + res.id + ')"></td>' +
    '<td>'+'<button type="button" class="btn btn-success btn-sm" id="btn-'+res.id+'" onclick="addBilling('+res.id+')">'+'add'+'</button>'+'</td>'
 '</tr>'
    document.getElementById('tableValues').innerHTML=resultsList
     });

 })
}
else{
let msg='<div class="text-warning"> login and continue</div>';
document.getElementById('msg').innerHTML=msg
}
  } 
  function updatePrice(index) {
    var quantityInput = document.getElementById('choosedQuantity-' + index);
    var priceElement = document.getElementById('price-' + index);
    console.log(values);
    var product = values.find(res=>res.id==index);    
    var totalPrice = product.price * quantityInput.value;
    priceElement.innerHTML = + totalPrice;
}


let search=document.getElementById('srch');
search.addEventListener('input', (event) => {
  findValue(event.target.value);
});
function findValue(searchTerm){
    console.log(values);
       resultsList= '';
     const filterdValues= values.filter((value)=> 
            value.productName.toLowerCase().includes(searchTerm.toLowerCase()));
            console.log(filterdValues);
            filterdValues.forEach((res) => {
              resultsList+='<tr>'+
              '<td id="name-' + res.id + '">'+res.productName+'</td>'+
              '<td id="price-' + res.id + '">₹' + res.price + '</td>' +
              '<td><input type="number" class="input-sm" value="1" id="choosedQuantity-' + res.id + '" min="1" onkeyup="updatePrice(' + res.id + ')"></td>' +
              '<td>'+'<button type="button" id="btn-'+res.id+'" class="btn btn-success btn-sm" onclick="addBilling('+res.id+')" >'+'add'+'</button>'+'</td>'
           '</tr>'
              document.getElementById('tableValues').innerHTML=resultsList
               }); 
}
 function addList(){
  let user= localStorage.getItem('user')
  if(user!=null && user!=""){
      let itemName=document.getElementById('content').value
      let itemPrice=document.getElementById('amt').value
      let itemQuantity=document.getElementById('qnt').value
      let result={
        user:user,
        productName:itemName,
        price:itemPrice,
        quantity:itemQuantity,
      }
         fetch(url,{
            method:'POST',
            body :JSON.stringify(result),
           headers:{'content-type':"application/json;charset=UTF-8"}
         }).then((res)=>res.json()).then(()=>window.location.href='./index')   
 }
 else{
 alert("login and continue");
 }
 }
 function addBilling(index){
  var quantityInput = document.getElementById('choosedQuantity-' + index).value;
  var priceElement = Number(document.getElementById('price-' + index).innerHTML); 
  var inputName = document.getElementById('name-' + index).innerHTML; 
   
  console.log(priceElement);
   let existingProduct=selectedProducts.find((value)=>value.productName==inputName)
   if(!existingProduct){
    let newValue={
      productName:inputName,
      productQuantity:quantityInput,
      productPrice:priceElement,
    }
    selectedProducts.push(newValue);  
    total+=priceElement
    gstAmount=Math.floor(total/100*18);
    finalAmount=gstAmount+total
  }
  else  {
    console.log(existingProduct);  
        // confirm(`already product Added !\n Else click Ok Change Quantity`);
        if(confirm(`already product Added !\n  click Ok Change Quantity`)==true){
        existingProduct.productQuantity=quantityInput;
        if(priceElement>existingProduct.productPrice){
           total=(total-existingProduct.productPrice)+(priceElement)
           gstAmount=Math.floor(total/100*18);
           finalAmount=gstAmount+total
           existingProduct.productPrice=priceElement;
        }
        else if(priceElement<existingProduct.productPrice)
             {
              total=(total-existingProduct.productPrice)+(priceElement)
              gstAmount=Math.floor(total/100*18);
              finalAmount=gstAmount+total
              existingProduct.productPrice=priceElement;
             }
            }         
  }  
        document.getElementById('amt').innerHTML=total
        document.getElementById('gst').innerHTML=gstAmount
        document.getElementById('fnl').innerHTML=finalAmount
         addSession();
      }
 function updateQuantity(prdName,quantity1){
  let user=localStorage.getItem('user')
  fetch(`${url}?productName=${prdName}&&user=${user}`,{
    method :'GET',
    headers:{
      'Content-Type': 'application/json',
    }
  }).then(response=>response.json())
  .then((data)=>{
    filteredData=data 
        filteredData.forEach((val)=>{ 
   let previousQuantity=val.quantity;
       let reducedQuantity=previousQuantity-quantity1;
       console.log(previousQuantity);
       console.log(quantity1);
       console.log(reducedQuantity);
        val.quantity=reducedQuantity;
        console.log(filteredData);
        console.log(val.id);
       fetch(`${url}/${val.id}`,{
        method:'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
         body:JSON.stringify({
           user:user,
          quantity:reducedQuantity,
          price:val.price,
          productName:val.productName
         })
       }).then(response=>response.json()).then(data=>console.log(data))
       
      })
      } )
 }

 function fetchBill(){
 let result= sessionStorage.getItem('myValues')
 let amount= sessionStorage.getItem('total')
 let gst= sessionStorage.getItem('gst')
 let finalAmount= sessionStorage.getItem('finalAmount')
 let date= sessionStorage.getItem('date');
 let time=sessionStorage.getItem('time');
 let customerName=sessionStorage.getItem('customerName');
let mobileNumber=sessionStorage.getItem('mobileNumber');
     let billingProducts=JSON.parse(result);
     console.log(billingProducts);
     let resultsList=''
 billingProducts.forEach((res,index) => {   
  resultsList+='<tr>'+      
    '<td id="name-' + index + '">'+res.productName+'</td>'+
    '<td id="price-' + index + '">' + res.productQuantity + '</td>' +
    '<td id="price-' + index + '">₹' + res.productPrice + '</td>' +
 '</tr>'
    document.getElementById('tableValues').innerHTML=resultsList
    document.getElementById('amount').innerHTML=amount
    document.getElementById('gst').innerHTML=gst
    document.getElementById('finalAmount').innerHTML=finalAmount
    document.getElementById('date').innerHTML=date
    document.getElementById('time').innerHTML=time
    document.getElementById('custName').innerHTML=customerName
    document.getElementById('mobile').innerHTML=mobileNumber
    console.log(res.productName);
   updateQuantity(res.productName,res.productQuantity);

 })
 }
  function printPage(){
    window.print()
  }
  function addSession(){
    let date= document.getElementById('date').value
    let time=document.getElementById('time').value
    let customerName=document.getElementById('name').value
    let mobileNumber=document.getElementById('number').value
   sessionStorage.setItem('myValues',JSON.stringify(selectedProducts));
   sessionStorage.setItem('total',JSON.stringify(total));
   sessionStorage.setItem('gst',JSON.stringify(gstAmount));
   sessionStorage.setItem('finalAmount',JSON.stringify(finalAmount));
   sessionStorage.setItem('date',JSON.stringify(date));
   sessionStorage.setItem('time',JSON.stringify(time));
   sessionStorage.setItem('customerName',JSON.stringify(customerName));
   sessionStorage.setItem('mobileNumber',JSON.stringify(mobileNumber));
  }
  function removeSession(){
     sessionStorage.removeItem('myValues');
     sessionStorage.removeItem('total');
     sessionStorage.removeItem('gst');
     sessionStorage.removeItem('finalAmount');
     sessionStorage.removeItem('date');
     sessionStorage.removeItem('time');
     window.location.href='./index'
     console.log('removed Sucessfully');
  }
  
  function checkLogin(){
   let user=localStorage.getItem('user');
   if(user){
    let result=''
  result='<button type="button" id="logOut" class="btn btn-danger" onclick="logOut()">logOut</button>'
  document.getElementById('btn').innerHTML=result
   }
   else{
   let result=''
 result='<button type="button" id="logOut" class="btn btn-success" onclick="login()" >LogIn</button>'
 document.getElementById('btn').innerHTML=result
   }
  }
  checkLogin()
  function login(){
    window.location.href='./login'
  }
  function logOut(){
    localStorage.removeItem('user');
    alert('loged out sucessfully');
  checkLogin();
  location.reload();
  }