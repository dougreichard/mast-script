
cast:
    @dawn
    @son
    @cast1

scenes:

    $test_startup:
        startup:
            // Colon 
            set @cast1.data: 5
            set @cast1: #security
            set @cast1.XP: #security.XP

            // Sets value on both
            set [@dawn @son].XP: 100
            set @dawn.o: {
                a: 1,
                b: 2
            }

            
            // Assign
            set @cast1.data = 5
            set [@dawn @son].XP = 100
            set [@dawn @son] = {"XP": 100, HP: 10}
            set @dawn.XP = #security.XP 

            // Add
            set @cast1.data += 5
            set [@dawn @son].XP += 100
            set @cast1.roles += #medic
            set @cast1.roles -= #medic

            // Multiply
            set @cast1.data *= 5
            set [@dawn @son].XP *= 100

            // Percentage
            set @cast1.data %= 5
            set [@dawn @son].XP %= 100




