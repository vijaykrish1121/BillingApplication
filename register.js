  function register(){
     let userName=document.getElementById('userName').value;
     let companyName=document.getElementById('companyName').value;
     let email=document.getElementById('email').value;
     let password=document.getElementById('password').value;
     let gstNo=document.getElementById('gst').value;
     if(userName!=''&&companyName!='' && email!=''&& password!='' && gstNo!=''){
     let details={
        userName:userName,
        companyName:companyName,
        email:email,
        gstNo:gstNo,
        password:password
     }
     console.log(userName);
     const url='https://retoolapi.dev/BBAzhF/data'
       fetch(url,{
        method:'POST',
        body:JSON.stringify(details),
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
       }).then((response)=>response.json).then(()=>window.location.href='./login')
       alert('register sucessfull')
      }
      else{
        document.getElementById('msg').innerHTML='<div class="text-danger">Fill all the field Correctly</div>';
      }
  }