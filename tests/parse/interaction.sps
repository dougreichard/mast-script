roles:
    #zombie `The undead`
    #human `The living`


cast:
    @dude #human `The dude` 

story:
    // allow chat
    interactions:
        ?chat #all `Chat` form:
            label `message`
            input message
            submit  `Send`:
                if 'a' == 'b':
                    tell #all `hello`
                else if 'b' >= 'c':
                    tell @dude `hi`
                else:
                    tell @dude 'hey'
                always:
                    tell #all `{{message}}`

            
    

scenes:
    $hello ('Alias') `test`:
        interactions: 
            ?A #human `sss`form:
                select weapon: 
                    `Pistol`
                    `Rifle`
                    `Knife`
                submit  `Select`

            ?B #human `sss` form:
                select weapon: 
                    `Pistol`
                    `Rifle`
                    `Knife`
                submit  `Select`:
                    if a.b.c: 
                        tell 's'
                    always:
                        tell "if weapon is `Rifle` and  @to.roles has #medic:"
                        tell @to `Medics cannot have a rifle`

            ?C #human `sss`form:
                select weapon:
                    `Pistol`
                    `Rifle`
                    `Knife`
                submit  `Select`: 
                    if (weapon == `Rifle`) and  (to.roles has-role #medic):
                        tell @to `Medics cannot have a rifle`
                    else if (weapon == `Knife`) and  (to.roles has-role #security):
                        tell @to `Security cannot have a rifle`
                    else:
                        complete *A
                        hide ?C

            ?D #human `sss` complete [*A *B]:
                tell `jgjj`


            ?E #human `sss` keys:
                `Right`:
                    tell ' d'  

            ?F #human `sss` media !room:
                click 123,456,12,50:
                    tell 'g'
                    set a.c = 2
                    set a.c %= 2
                    set a.c += 2
                    set a.c *= 2
                    set a.c -= 2
                    
