cast:
    @land ` `
    @dawn ` `
    @son ` `

scenes:
    $one : 
        objectives:
            *A [@dawn @son]  `You must get to the landing site`:
                when near @dawn @land:
                    scene $two
    
    $two:
        startup:
            tell @son `hello`
