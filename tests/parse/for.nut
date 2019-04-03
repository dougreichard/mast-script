cast:
    @counter 
scenes:
    $countdown ('EXT. a rocket stands ready to launch'):
        startup:
            for i in [10,9,8,8,7,6,5,4,3,2,1,'liftoff']:
                as @counter tell '${i.value}'
                tell '${i.index}'
                delay 1s
            
            for i in range(1,10):
                tell `${i.value}`
                tell `${i.index}`

            for i in range(10):
                tell `${i.value}`
                tell `${i.index}`

            for i in range(1,10,2):
                tell `${i.value}`
                tell `${i.index}`
