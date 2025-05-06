// document.getElementById('srch').addEventListener('keyup',findValue());
let values=[];
let selectedProducts=[];
let details=[];
let filteredData=[];
let total=0;
let gstAmount=0;
let finalAmount=0;
 const url='https://retoolapi.dev/ewPBx0/data';

 function fetchData() {
  updateLoginUI();
  const user = localStorage.getItem('user');

  if (user && user.trim() !== '') {
    fetch(`${url}?user=${user}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        document.getElementById('tableValues').innerHTML = '<tr><td colspan="4" class="text-center text-muted">No products available</td></tr>';
        return;
      }

      const values = data.sort((a, b) => 
        a.productName.toLowerCase().localeCompare(b.productName.toLowerCase())
      );

      let resultsList = '';

      values.forEach(res => {
   
        resultsList += `
          <tr id="row-${res.id}">
            <td id="name-${res.id}">${res.productName}</td>
            <td id="price-${res.id}">₹${res.price}</td>
            <td>
              <input type="number" class="form-control form-control-sm" value="1" min="1" id="choosedQuantity-${res.id}" onkeyup="updatePrice(${res.id})">
            </td>
        <td id="stock-${res.id}" class="${res.quantity > 0 ? '' : 'text-danger'}">
  ${res.quantity > 0 ? res.quantity : 'Not in Stock'}
</td>
            <td id="subtotal-${res.id}">₹${res.price}</td> <!-- Subtotal cell -->
            <td>
              <button type="button" class="btn btn-success btn-sm" onclick="addBilling(${res.id})">Add</button>
            </td>
          </tr>
        `;
      });

      document.getElementById('tableValues').innerHTML = resultsList;
    })
    .catch(error => {
      console.error('Error fetching product data:', error);
      document.getElementById('tableValues').innerHTML = '<tr><td colspan="4" class="text-danger text-center">Error loading products</td></tr>';
    });

  } else {
    const msg = '<div class="text-warning">Please login to continue</div>';
    document.getElementById('msg').innerHTML = msg;
  }
}

function updatePrice(id) {
  const price = parseFloat(document.getElementById(`price-${id}`).textContent.replace('₹', '')) || 0;
  const quantity = parseInt(document.getElementById(`choosedQuantity-${id}`).value) || 1;
  const subtotal = price * quantity;

  document.getElementById(`subtotal-${id}`).textContent = `₹${subtotal.toFixed(2)}`;
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
         }).then((res)=>res.json()).then(()=>window.location.href='./index.html')   
 }
 else{
 alert("login and continue");
 }
 }
 function addBilling(index) {
  const stock = document.getElementById('stock-' + index).innerText;
  if (stock === "Not in Stock") {
    alert("Cannot add. This product is out of stock.");
    return;
  }
  const quantityInput = Number(document.getElementById('choosedQuantity-' + index).value);
  const priceText = document.getElementById('price-' + index).innerText; // e.g., "₹100"
  const priceElement = Number(priceText.replace(/[^\d.]/g, '')); // Removes ₹ symbol
  const inputName = document.getElementById('name-' + index).innerText;

  if (isNaN(quantityInput) || quantityInput < 1) {
    alert("Please enter a valid quantity.");
    return;
  }

  const totalProductPrice = priceElement * quantityInput;

  let existingProduct = selectedProducts.find((value) => value.productName === inputName);

  if (!existingProduct) {
    let newValue = {
      productName: inputName,
      productQuantity: quantityInput,
      productPrice: totalProductPrice,
    };
    selectedProducts.push(newValue);
    total += totalProductPrice;
  } else {
    if (confirm(`Product already added!\nClick OK to update the quantity.`)) {
      total = total - existingProduct.productPrice + totalProductPrice;
      existingProduct.productQuantity = quantityInput;
      existingProduct.productPrice = totalProductPrice;
    }
  }

  gstAmount = Math.floor((total * 18) / 100);
  finalAmount = total + gstAmount;

  document.getElementById('amt').innerText = total.toFixed(2);
  document.getElementById('gst').innerText = gstAmount.toFixed(2);
  document.getElementById('fnl').innerText = finalAmount.toFixed(2);

  addSession();
}


function updateQuantity(prdName, quantity1) {
  let user = localStorage.getItem('user');
  if (!user || !prdName || isNaN(quantity1)) {
    console.error("Invalid input to updateQuantity");
    return;
  }

  fetch(`${url}?productName=${encodeURIComponent(prdName)}&user=${encodeURIComponent(user)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then((data) => {
    data.forEach((val) => {
      const previousQuantity = Number(val.quantity);
      const reducedQuantity = previousQuantity - Number(quantity1);

      if (reducedQuantity < 0) {
        alert(`Error: Reduced quantity is negative for product ${val.productName}`);
        return;
      }

      fetch(`${url}/${val.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: user,
          quantity: reducedQuantity,
          price: val.price,
          productName: val.productName
        })
      })
      .then(response => response.json())
      .then(updated => {
        console.log("Quantity updated:", updated);
      })
      .catch(error => console.error("PUT request failed:", error));
    });
  })
  .catch(error => {
    console.error("GET request failed:", error);
  });
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
     window.location.href='./index.html'
     console.log('removed Sucessfully');
  }
  
  function login() {
     window.location.href="./login.html"
  }
  function logout() {
    localStorage.removeItem("user");
    location.reload();   
     alert("Logged out successfully!");
  }
   updateLoginUI();
  function updateLoginUI() {
    const isLoggedIn = localStorage.getItem("user") ;
    document.getElementById("loginBtn").style.display = isLoggedIn ? "none" : "inline-block";
    document.getElementById("logoutBtn").style.display = isLoggedIn ? "inline-block" : "none";
  }