(defun factorial (n) 
    (if (= n 0) 
        (return-from factorial 1) 
        (return-from factorial (* n (factorial (- n 1))))
    )
)

(print (factorial 10))