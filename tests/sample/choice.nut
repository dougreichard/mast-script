cast:
    <value {XP: 2, HP:5}>
    @test ('Doug') 

story:
    enter:
        `${@test<meta>.alias} your XP is ${@test.XP} your HP is ${@test.HP}`

    (`INT. DAY Office`):
        ('The camera dollies in through a doorway landing in front of the desk')

        @test:
            ('slouched over paper pencil in hand writing frantically')
            <whispering>
            "Where is it..."
            ('hand goes through the hair showing frustration')
            "Where is the money"

        ('The camera pans out the window overlooking the city')
    



    ?test @test `Choose your fate` choice:
        "Impact XP":
            set @test.XP += 1
            scene story

        "Impact HP":
            set @test.HP -= 1
            scene story
        "end":
            pass
    
    
    leave:
        `Final stats XP=${@test.XP}  HP=${@test.HP}`
        `the end`
    