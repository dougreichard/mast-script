cast:
    @a ``
    @b ``



scenes:
    $hello `test`:
        interactions:
            ?A @a "look for b" search @b
            ?B @b "look for a" search @a




    $hello1 ('Alias') `test
multi
line` :
        
    
    $hello2 ('Alias') `test`:
        interactions:
            ?A @a "look for b" search @b
            ?B @b "look for a" search @a

    -$hello3 ('Alias') `test`: 
        interactions:
            ?A @a "look for b" search @b
            ?B @b "look for a" search @a

    sub $hello4 ('Alias') `test`:
        interactions:
            ?A @a "look for b" search @b
            ?B @b "look for a" search @a

    $hello5 ('Alias') `test`:
        interactions:
            ?A @a "look for b" search @b
            ?B @b "look for a" search @a

    $hello6:
        interactions:
            ?A @a "look for b" search @b

    $hello7 ('A7'):
        interactions:
            ?A @a "look for b" search @b

    $hello8 ('A8') 'test':
        interactions:
            ?A @a "look for b" search @b