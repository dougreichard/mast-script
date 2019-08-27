cast:
    <css {width: "2em", color:"blue"}>
    <Health {XP: 2, HP:5}>
    <test 2>
    @test ('Doug was here') 

    <value {
        XP: 0,
        HP: 1
    }>
    @test2 
    <value {
        XP: 0,
        HP: 1
    }>
    @test3 

<title> 
<author>
<formatter "mastDown">
story:
    startup:
        `${@test<test>}`
        `${@test<meta>.alias}`
        `2 = ${@test.XP}`
        set @test.XP += 2

        `4 = ${@test.XP}`
        `4 = ${@test.css.width}`
        set @test.XP %+ 100
        `8 = ${@test.XP}`
        set [@test @test2].HP *= 2
        `10 = **${@test.HP}** 2 = **${@test2.HP}**`

    enter:
        for i in range(1,10,1):
            set @test3.HP = @test3<value>.XP
            set @test3.XP += i
            `XP = ${@test3.XP}`
            
            `HP = ${@test3.HP}`
            2s
           
    <skip>
    - skip:
        <transition {type: "FADEOUT"}>
        do skip
        <transition {type: "FADEOUT"}>
        do skip
    - thisTo:
        tell "Me a story"

    <css>
    leave:
        <hello "World">
        @test:
            <whispering>
            "goodbye"
            2s
            "I'll return"
        @test2:
            "good...bye"
