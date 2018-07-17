cast:
    @land ` `
    @dawn ` `
    @son ` `

scenes:
    $in('Transport In') `Dawn and son are reuired t get to the transport landing zone for the story to continue`:
        // Dand can see the landing site and @son
        // etc.
        objectives:
            *A [@dawn @son]  `You must get to the landing site`:
                when near  @dawn  @land: 
                    tell #all `Dawn has arrived at site`
                when near  @son  @land: 
                    tell #all `Dawn has arrived at site`
                when near @son @land and near @dawn @land:
                    complete

        interactions:
            ?A [@dawn @son] "Get to the landing site" search  @land



    $one :
        objectives: 
            *A [@dawn @son]  `You must get to the landing site`:
                when near  @dawn  @land: 
                    tell #all `Dawn has arrived at site`
                when near  @son  @land: 
                    tell #all `Dawn has arrived at site`
                when near @son @land and near @dawn @land:
                    complete
