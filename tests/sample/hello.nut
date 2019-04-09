cast: 
    @world

story:
    startup:
        tell @world "hello"

    enter:
        tell @world "Hello, again"

    ?Stay @hello 'Stay or go' choice:
        'Stay':
            scene story
        'Go':
            pass
    leave:
        tell @world "goodbye"
        
    
