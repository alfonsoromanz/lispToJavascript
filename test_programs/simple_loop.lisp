(defvar a 0)
(loop 
    (setq a (+ a 1)) 
    (when (> a 10) (return a))
)