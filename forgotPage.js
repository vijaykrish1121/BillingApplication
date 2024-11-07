  let detail=[]
  function forgotPassword(){
  let email= document.getElementById('email').value;
  let pass=document.getElementById('password').value
  let confrmPass=document.getElementById('confrmPassword').value
  console.log(pass);
  let url='https://retoolapi.dev/BBAzhF/data'
   if(pass==confrmPass){
  fetch(`${url}?email=${email}`,{
    method:'GET'
  }).then(response=>response.json()).then(value=>{
    if(value=''){
 detail=value;
      detail.forEach(element => {
        element.password=pass;
          fetch(`${url}/${element.id}`,{
            method:'PUT',
            headers: {
               'Content-Type': 'application/json'
              },
            body:JSON.stringify(element),
          }).then(res=>res.json).then(response=>console.log(response))
      });
    }
    else
    document.getElementById('msg').innerHTML='<div class="text-danger">User not registered Register And continue</div>';
    })
}
 else
 document.getElementById('msg').innerHTML='<div class="text-danger">Password and confirmPassword must be same</div>';
}