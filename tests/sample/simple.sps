roles:
    #zombie `The undead`
    #human `The living`


cast:
    @dude #human `The dude`
    @err  #not `the test`
    @err2  #recover `the test`
    @err  #human `redefine`
    @err3  [#human #nerd #stop] `redefine`

scenes:
    $hello `test
    
{{@son.XP}}
    
`:
        startup:
            tell @dude `this is OK`
            tell [@dude @fred] `fred is not`
            tell @wilma `wilmna is not`
            tell [#flintstone #rubble]  `Yabadaba doo`
            scene $dino
            scene $theend

    $hello ('Alias') `test`:
        startup:
            tell @dude `hello`
