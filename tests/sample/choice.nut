cast:
    <value {XP: 2, HP:5}>
    @hero ('Doug') 

story:
    enter:
        `${@hero<meta>.alias} your XP is ${@hero.XP} your HP is ${@hero.HP}`

    (`INT. DAY Office`):
        ('The camera dollies in through a doorway landing in front of the desk')

        @hero:
            ('slouched over paper pencil in hand writing frantically')
            <whispering>
            "Where is it..."
            ('hand goes through the hair showing frustration')
            "Where is the money"

        ('The camera pans out the window overlooking the city')
    



    ?test @hero `Choose your fate` choice:
        "Impact XP":
            set @hero.XP += 1
            scene story

        "Impact HP":
            set @hero.HP -= 1
            scene story
        "end":
            pass
    
    
    leave:
        `Final stats XP=${@hero.XP}  HP=${@hero.HP}`
        `the end`
    