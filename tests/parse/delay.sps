scenes:
    $hello `test`:
        startup:
            delay 500ms:
                tell #story `delay over`
            delay 10s:
                tell #scene `delay over` 
            delay 30m: 
                tell #story `delay over` 

    $hello2 `test2`:
        startup:
            delay 10s 500ms:
                 tell #story `delay over`
            delay 3m 10s:
                tell #scene `delay over` 
            delay 30m: 
                tell #story `delay over` 
