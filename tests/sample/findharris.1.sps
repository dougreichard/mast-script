// Roles
roles:
    #security `Protective forces`
    #damcom `grunt workers`
    #diplomat `Smooth Talkers`
    #native `Silicon life forms indigineous to the planet`
    #medic `healthy compainions`
    #command `Leader of the pack`


// Cast
cast:
    @dawn('Dawn Patrol') [#command #required] `heroic commander of the Knight`  
    @son('Son of Dawn Patrol')  [#security #required] `A raw recruit living under the shadow of Dawn`
    @harris('Colonel Jonathan Harris') [#diplomat #required] `Must be rescued. Only survivor seems to complain about pain.` 

    // These are extras that can have multiple
    // Extra players are able to choose from these
    @phodder('Phazer Phodder')  [#security #clone] `To blindly go, and rarely return` 
    @rocky  [#security #clone]  `Natives, what are their motives?`

    // Props
    @artifact('Ancient Artifact') [#required #prop] `Mystery Device`
    @land('Transport Landing Zone') [#required #prop] `This is the starting location for Dawn and Son`
    @crash('Shuttle crash site') [#required #prop] `Last known location of Harris`
    @extract('Transporter Extraction Point')  [#required #prop] `Ending location`

    // NPC 
    @queen('Glowing Native') #npc `Story element`


scenes:

    $startup `This is the startup scene`:
        // This could be done in $story but added as an example
        // Wait for required to also be joined, The system adds #joined
        objectives:
            objective *allin #required `get everyone to play`:
                when has-role #required  #joined:
                    scene $in


    // Note using aliases
    //                     vvvvvv This scene text is also told to $story
    $in('Transport In') `Dawn and son are reuired t get to the transport landing zone for the story to continue`:
        objectives:
            objective *A @dawn `You must get to the landing site`:
                when near @dawn  @land: 
                    tell #all `Dawn has arrived at site`
                    complete 

            objective *B @son `You must get to the landing site`: 
                when near @son @land:
                    tell #all `Son has arrived` 

    /*
            objective *arrive [@dawn @son] `All objectives complete`:
                when complete [*A *B]:  
                    tell #all _
                    `Dawn and son transport down from the the Knight down to the planet surface.
                    The surface is harsh and rocky. The rocks and mountains have streaks of lava flowing and glowing.
                
                    delay 5s    ` 
                    scene $find_site */  


        // Dand can see the landing site and @son
        // etc.
        interactions:
            search @land [@dawn @son]

        startup:
            // Maybe new variables could be like this
            set @dawn.newVariable: 52
            set @story.newVarOnWholeGame:  42
            set #native.varOnAllForRole:  32 // Does this make any sense?

            // Watch these 
    
    $find_site('Find the shuttle site')  `Now on the planet Dawn and Son set out to find the shuttle crash site.`:
        objectives:
            // Mission fails if dawn finds harris too soon
            objective *A @dawn `Find only the site`:
                when near @dawn @harris:
                    scene $failure1

            objective *B @son `Find only the site`: 
                when near @son @harris:
                    scene $failure1

            objective *C @harris `Find the artifact`: 
                when near @harris @artifact:
                    tell @harris `You have found the artifact`
                    complete

            objective *D @dawn `Find the artifact`: 
                when near @dawn @crash:
                    tell @dawn `You have found the site`
                    complete

            objective *E @son `Find the artifact`: 
                when near @son @crash:
                    tell @son `You have found the site`

            objective *end #all `All Objectives Completed`: 
                when complete [*C *D *E]: 
                    scene $find_harris

        interactions:
            search @dawn  [@son @crash]
            search @son [@dawn @crash]
        
        startup:
            tell @harris `You are searching for a long lost artifact. Your searchers suddenly detect it is near you go to it.
            You must find this at all costs. If you see the rescue squad avoid them or you will fail`



    $find_harris('Find Harris')   
    `Now that dawn and son have found the crash site they are at a loss on where harris is.
    They search the crash site. They find footsteps, but the trail ends with several long troughs going off in the same direction.
    Worried they draw weapons and follow the trail. `
    :
        objectives:
            objective *dawn_artifact @dawn `Dawn to the artifact`:
                when near @dawn  @artifact:
                    scene $find_extract

        interactions:
            search @dawn @artifact

            interaction ?stay:
                form:
                    label `Since arriving at the crash site Dawn has been acting strange. 
She claims she knows where to go. But you see nothing on your scans.`

                    select choice `Do you stay or go?`:
                        go `Go on your own`
                        stay `Stay with dawn`
                    submit
                if choice=='go':
                    scene $failure2
                else:
                    complete
                    delay 5s:
                        ask ?stay @son

        startup:
            tell @dawn `you have a strong feeling to go toward an artifact. You are unsure why this feeling is within you. But you track they artifact. `

            delay 5s:
                ask ?stay @son

            tell @harris `You must try to communicate with the artifact. Send it message to @artifact ` 



    $find_extract('Leave Planet') `Now that all is found Dawn, Son, Harris and the artifact must get back to the ship.`:
        objectives:    
            objective *extract [@dawn @son @harris] `All reach`:
                when near [@dawn @son @harris @artifact] @extract:
                    scene $success 

        interactions:
            search [@dawn @son @harris @artifact] @extract 
        
        startup: 
            tell @dawn `You are the leader get the group to the zone.`

        
    $success('Return to ship') `Having reached the extraction point you all return to the ship safely. The end.` :
    $failure1('Failure no artifact') `Having found Harris too early he could not complete his mission. You have failed.` :
    $failure2('Failure son lost trust') `Son of Dawn's lack of trust hase mad this mission a failure` :
