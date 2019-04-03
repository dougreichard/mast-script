roles:
    #viking

scenes:
    $test_startup:
        startup:
            tell #viking `Yo`


    $test_enter:
        enter:
            tell #viking `Yo`

    $test_leave:
        leave:
            tell #viking `Yo`

    $test_all:
        startup:
            tell #viking `Yo`

        enter:
            tell #viking `Yo`

        leave:
            tell #viking `Yo`
