(defvar a 3)
(defvar b 5)

(if (> a b) 
    (setq b a) 
    (setq a b)
)

(if (= a b) 
    (progn 
        (setq a 0) 
        (setq b 0)
    ) 
    (progn 
        (print a) 
        (print b)
    )
)