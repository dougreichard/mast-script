## Story flow
The story has several subsections to organize the flow of the story. We have been using the startup section up until now.

* Startup: Runs once the first time the story is 'played'
* Enter: Runs each time the story is played
* Leave: Runs each before the story transitions to another scene
* Finally: Runs when all of the story is played out

Each of these sections are optional.

```
story:
    startup:
        "startup"
    enter:
        "enter"
        
    leave:
        "leave"

    finally:
        "the end"

```

## Example output
```
startup
enter
shot
leave
the end
```

# Shots
In addition to states a story and scenes can have 'shots'. Shots are another way to organize content.
Shots are placed after the enter section and before the leave section.
Shots will run in this order.

```
story:
    startup:
        "startup"
    enter:
        "enter"

    shot1:
        "shot1"

    shot2:
        "shot2"

    leave:
        "leave"
```



## Shot properties
Shots can have a name, and a cue section followed my a block of commands. 

You can specify the shot name and the cue followed by the block of commands.

```
  //name     cue         
    myshot ('INT. Office'):
        tell 'Hello'
```

You can specify a just shot name

```
    myshot:
        tell "A shot with just a name"
```
Or just the Cue
```
    ('INT. Office'):
        tell "Just an alias"
```

