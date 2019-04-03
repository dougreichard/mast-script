script('Space Oddity') `example` $main

roles:
    #communication 'a person who communicates'
    #explorer 'a person that explores'

cast:
    @groundControl ('Ground Control') #communication 'An earth based communication person'
    @counter ('the countdown timer') #communication 
    @majorTom ('Major Tom') #explorer  'An explorer of space'

scenes:
    $main ('INT. space launch control center'):
        startup:
            as @groundControl tell @majorTom 'take your protein pills and put you helmet on'

        leave:
            scene $countdown

    
    $countdown ('EXT. a rocket stands ready to launch'):
        startup:
            // for i in [10,9,8,8,7,6,5,4,3,2,1,'liftoff']:
            as @counter tell  '${i}'
            delay 1s
        
    $liftoff ('EXT. in Orbit above a planet'):
        startup:
            as @groundControl tell  @majorTom 'take your protein pills and put you helmet on'
            as @majorTom tell  @groundControl `I'm steppin' through the door and I'm floating in a most peculiar way`

    $spacewalk ('EXT. in Orbit above a planet'):
        startup:
            as @groundControl tell  @majorTom 'take your protein pills and put you helmet on'
            as @majorTom tell  @groundControl `I'm steppin' through the door and I'm floating in a most peculiar way`
