# Structure

> Note: This is a work in progress and prone to change

## A note on Whitespace
Mast Script is an indention based language. Sections in the language use indention to show the content that a subset of another section.

Spaces should be used instead of tab characters. Using an editor that can automatically convert the tab to space helps.

## The simplest story
The starting point of your narrative is the "story" section.

Below is a simple story. At startup is simple tells the audience "Once upon a time", and then tells the audience "the end"

Quoted strings are called a tell command. They are how you tell the story.

```
story:
    startup:
        "Once upon a time"
        "the end"
```

## The Tell command

The tell command can also be explicitly included or not. It may help you to see the tell command when your strings are long.

You can place strings between single quotes, double quotes, or back quotes. Back quotes may be easier since you may uses quotes to show speech or for apostrophes.
```
story:
    startup:
        tell `Once upon a time`
        tell `I used back quotes`
        tell 'I used single quotes'
        tell "I used Double quotes"
```

## Multi-line strings
Strings with tell commands and other areas can span multiple lines. Note within the string you don't need to keep indention. But be mindful of keeping the indention correct for the next command.
``` 
story:
    startup:
        tell `
Once upon a time
There was a multi-line string
and it worked just fine`
        tell `the end`

```

