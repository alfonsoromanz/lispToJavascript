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
      transpiledInput.value = formatJavaScript(result.javascript);
    } else {
        let errorMessage = ""
        for(let i=0; i<result.errors.length; i++) {
            errorMessage += result.errors[i] + '\n';  
        }
        transpiledInput.value= errorMessage;
    }
          
  });
}

const formatJavaScript = (code) => {
  if (!code) return '';
  
  let formatted = '';
  let indentLevel = 0;
  const indentSize = 2;
  const lines = code.split('\n');
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Decrease indent for closing braces
    if (trimmed.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    
    // Add indentation
    formatted += ' '.repeat(indentLevel * indentSize) + trimmed + '\n';
    
    // Increase indent for opening braces
    if (trimmed.endsWith('{') && !trimmed.startsWith('}')) {
      indentLevel++;
    }
  }
  
  return formatted.trim();
}

const examples = {
  factorial: `(defun factorial (n) 
    (if (= n 0) 
        (return-from factorial 1) 
        (return-from factorial (* n (factorial (- n 1))))
    )
)

(print (factorial 10))`,
  
  sum: `(defun sum (a b) 
    (return-from sum (+ a b))
)
(defvar x (+ 3 2))
(defvar y 5)
(defvar result (sum x y))
(print "Now the result:")
(print result)`,
  
  loop: `(defvar a 0)
(loop 
    (setq a (+ a 1)) 
    (when (> a 10) (return a))
)`,
  
  recursive: `(defun printUntilZero (a) 
    (if (> a 0) 
        (progn 
            (print a) 
            (setq a (- a 1)) 
            (printUntilZero a)
        ) 
        (print a))
)

(printUntilZero 10)`
};

const showExamples = () => {
  document.getElementById('examplesModal').classList.add('show');
}

const closeExamples = () => {
  document.getElementById('examplesModal').classList.remove('show');
}

const loadExample = (exampleName) => {
  const codeInput = document.querySelector('#code');
  if (examples[exampleName]) {
    codeInput.value = examples[exampleName];
    convertCode();
    closeExamples();
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  const examplesBtn = document.getElementById('examplesBtn');
  if (examplesBtn) {
    examplesBtn.addEventListener('click', showExamples);
  }
  
  // Close modal when clicking outside
  document.getElementById('examplesModal').addEventListener('click', (e) => {
    if (e.target.id === 'examplesModal') {
      closeExamples();
    }
  });
});