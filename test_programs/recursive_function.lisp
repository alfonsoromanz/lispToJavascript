(defun printUntilZero (a) 
(if (> a 0) (progn (print a) (setq a (- a 1)) (printUntilZero a)) (print a))
)

(printUntilZero 10)