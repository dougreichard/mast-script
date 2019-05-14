script('Space Oddity') `example` $main

roles:
    #friendly  ('test') 'test'
    #foe ('test')
    #noise

cast:
    <value {b: true, XP: 2, HP:5, s: 'hello', a: [1,2,3], n: null, o: {a:0, b:1}}>
    @hero ('Doug') 
    @heal 
    <zip>
    <void>
    @zero ('nada') 'nothing'

story:
    enter:
        tell [@hero @zero]
        `${@hero<meta>.alias} your XP is ${@hero.XP} your HP is ${@hero.HP}`
        

    (`INT. DAY Office`):
        ('The camera dollies in through a doorway landing in front of the desk')

        @hero:
            ('slouched over paper pencil in hand writing frantically')
            <whispering>
            "Where is it..."
            ('hand goes through the hair showing frustration')
            "Where is the money"
            set @zero.HP = 10

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
    