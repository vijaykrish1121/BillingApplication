const url='https://retoolapi.dev/gFQjF2/data';
let datas=[]
function getData(){
     fetch(url,{
        method:'GET'
     }).then((response)=>response.json()).then((values)=>{
      console.log(values);
      datas=values;
     })
}

function checkDetail(){
    let inputEmail=document.getElementById('email').value;
    let inputPassword=document.getElementById('password').value;
    datas.forEach(res=> {
        console.log(datas);
        console.log(res);
        console.log(res.password);
        console.log(res.email);
        if(inputEmail==res.email && inputPassword==res.password){
                localStorage.setItem('user',res.email)
               sessionStorage.setItem('user',res.email)
                 window.location.href='./index.html'
                   
          alert("Login successful!");
        }
        else{
        document.getElementById('msg').innerHTML='<div class="text-danger">invaild user or Register and Continue</div>';  
        }
    }
    )
}