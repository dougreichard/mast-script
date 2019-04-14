script('Space Oddity') `example` $prelaunch

roles:
    #communication 'a person who communicates'
    #explorer 'a person that explores'

cast:
    @groundControl ('Ground Control') #communication  'An earth based communication person'
    @counter  ('the countdown timer') #communication
    @majorTom ('Major Tom') #explorer  'An explorer of space'

scenes:
    $prelaunch ('EXT. a rocket stands ready to launch'):
        // This overrides the order of the shot list
        // showing reuse and doing things in parallel
        startup:
            do callsign
            delay 1s
            do callsign
            delay 1s
            do together [countdown launch_comms]
            scene $liftoff

        callsign:
            as @groundControl tell  @majorTom 'Ground Control to Major Tom'

        countdown:
            for i in range(10,1,-1):
                as @counter tell  '${i}'
                delay 1s
            as @counter tell `liftoff`
        
        launch_comms:
            as @groundControl  tell @majorTom `Ground Control to Major Tom`
            delay 4s
            as @majorTom tell @groundControl `Commencing countdown, engines on `
            delay 3s
            as @groundControl tell @majorTom `Check ignition and may God's love be with you `


    $liftoff ('EXT. rocket flies into Orbit above a planet'):
        // this one does stuff in startup and changes scene in leave
        startup:
            as @groundControl tell  @majorTom `
This is Ground Control to Major Tom'
You've really made the grade
And the papers want to know whose shirts you wear`

        leave:
            scene $spacewalk


    $spacewalk:
        // Also the shots don't need label since they are not referenced
        // The Alias text is not 'shown'
        ('EXT. Tom is in space suit looking out the window we see him through the window' ):
            as @groundControl tell  @majorTom `Now it's time to leave the capsule if you dare`
        
        ('INT. Tom is in space suit looking out open door'):
            as @majorTom tell @groundControl "This is Major Tom to Ground Control"

        // shortcut for "as @majorTom tell story"
        ('EXT. Tom is in space suit stepping out open door'):
            @majorTom "I'm stepping through the door"

        ('EXT. Tom is in space suit stepping out open door but the ship flies on'):
            @majorTom 
            {x:1} 
            `And I'm floating in a most peculiar way`

        (`EXT. Closeup tom's visor filled with stars`):
            @majorTom `And the stars look very different today`

        // It would goto '$floating anyway, but this
        // shows you overriding behavior
        leave: 
            delay 500ms
            scene $floating


    $floating: 
        (`EXT. Long shot Tom above the earth tethered and dragged by ship`):
            @majorTom `
For here
Am I sitting in a tin can
Far above the world
Planet Earth is blue
And there's nothing I can do
`
        (`EXT. Tom still dragged by ship but earth is far away`):
            @majorTom `
Though I'm past one hundred thousand miles
I'm feeling very still
And I think my spaceship knows which way to go
`
            @majorTom `Tell my wife I love her very much`
            @groundControl `she knows`

        (`INT. Control Center`):
            as @groundControl tell @majorTom `Ground Control to Major Tom`
            as @groundControl tell @majorTom `Your circuit's dead, there's something wrong`
            for range(3):
                as @groundControl tell @majorTom `Can you hear me, Major Tom?`
                delay 500ms
                @groundControl `Can you...`

        (`EXT. Tom is almost orbiting the ship being dragged above the moon`):
            @majorTom `Here am I floating 'round my tin can`
            @majorTom  `Far above the moon`

        (`EXT. Earth rises beind them moon and tom`) {
            r: 2,
            x: "hello"
        }:
            @majorTom `Planet Earth is blue`
            @majorTom `And there's nothing I can do`

         ?D #human `sss` complete [*A *B]:
                tell `jgjj`
        
        


