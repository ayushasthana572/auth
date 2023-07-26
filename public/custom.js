const profile = document.getElementById('profile');
fetch('/getUser')
        .then((res)=>{
            if(res.status === 200){
                return res.json(); 
            }
            else{
                alert("Something weird happened!!!");
            }
        }).then((data)=>{
             profile.innerHTML=`<img src ="account.png" width="20px"> ${data}`;
    });

function logout(){
    fetch('/logout')
        .then((res)=>{
            if(res.status === 200){
                return true;
            }
            else{
                alert("Something weird happened!!!");
                return false;
            }
        })
}