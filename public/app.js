// Establish a Socket.io connection
const socket = io();
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(feathers.socketio(socket));
// Use localStorage to store our login token
client.configure(feathers.authentication({
  storage: window.localStorage
}));

const convertCode = () => {
  const input = document.querySelector('#code');
  const lispCode = input.value;
  client.service('convertToJS').create({
    lispCode
  }).then((result)=>{
    const transpiledInput = document.querySelector('#transpiledCode');
    console.log(result);
    if (result.success) {
      transpiledInput.value = result.javascript;
    } else {
        let errorMessage = ""
        for(let i=0; i<result.errors.length; i++) {
            errorMessage += result.errors[i] + '\n';  
        }
        transpiledInput.value= errorMessage;
    }
          
  });
}