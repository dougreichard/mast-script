

story:
    test:
        "test individual"
        do one
        do two
        do three

    test2:
        "test set"
        do [one two three]

    test3:
        "test together"
        do together [one two three]


    - two:
        delay 200ms
        "two"
        

    - one:
        delay 300ms
        "one"
        

    - three:
        "three"
        

    leave:
        "the end"