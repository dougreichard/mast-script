roles:
    #viking

cast:
    @eric #viking
    @cast1
    @cast2

scenes:
    $hello `test`:
        startup:
            tell @cast1 `hello`
            tell #all `hello to all`
            tell [@cast1 @cast2] `test group`
