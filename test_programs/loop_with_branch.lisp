(defvar count 10)
(loop 
    (if (> count 1) 
        (setq count (- count 1)) 
        (progn 
            (setq count (- count 1))
            (print "last iteration")
        )
    ) 
    (when (> count 0) (return count))
)