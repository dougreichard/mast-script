roles:
    #zombie `The undead`
    #human `The living`


cast:
    @dude #human `The dude` 

story:
    // allow chat
    interactions:
        ?chat @dude `Chat`form:
            label `message`
            input message
            submit  `Send`
        if:
            tell @from `{{message}}`
            
    

scenes:
    $hello ('Alias') `test`:
        interactions: 
            ?A #human `sss`:
                form:
                    select weapon: 
                        Pistol
                        Rifle
                        Knife
                    submit  `Select` 

            ?B #human `sss`:
                form:
                    select weapon: 
                        Pistol
                        Rifle
                        Knife
                    submit  `Select` 
                if weapon is `Rifle` and  @to.roles has #medic:
                    tell @to `Medics cannot have a rifle`


            interaction #human `sss`:
                form:
                    select weapon:
                        Pistol
                        Rifle
                        Knife
                    submit  `Select` 
                if weapon == `Rifle` and  @to.roles has #medic:
                    tell @to `Medics cannot have a rifle`
                else weapon == `Knife` and  @to.roles has #security:
                    tell @to `Security cannot have a rifle`
                else:
                    complete
