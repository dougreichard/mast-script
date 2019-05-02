script('Space Oddity') `example` $main


scenes:
    $main ('INT. space launch control center'):
        startup:
            tell @majorTom 'take your protein pills and put you helmet on'

        leave:
            scene $countdown

    
    $countdown ('EXT. a rocket stands ready to launch'):
        startup:
            delay 1s
        
    