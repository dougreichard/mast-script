roles:
    // You can have multiple zombies
    #zombie `The undead`
    // and multiple human
    #human `The living`
    // 
    #last 'the last one alive'

cast:
    @somebody ('not real') `just an example cast person'
   
story:
    startup:
        set #all {conversions: 0, eradicate: 0}
        scene pick [$spawn_one, $spawn_two, $spawn_three]

    objectives:
        *survive #human "Be the last to survive"
        *convert #zombie "Covert the most humans to zombie"

// scenes for this script are more like rooms
scenes: 
    $spawn_one:
        startup:
            tell "You in a room "
        
        interactions:
            ?door "Pick a door" choice:
                "West":
                    scene room_1a
                "East":
                    scene room_1b
                "South":
                    scene room_1c


        