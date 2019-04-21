cast:
    @test {
        XP: 2,
        HP: 5
    }
    @test2 {
        XP: 0,
        HP: 1
    }
    @test3 {
        XP: 0
    }
story {x: 0}:
    startup:
        `2 = ${@test.XP}`
        set @test.XP += 2
        `4 = ${@test.XP}`
        set @test.XP %+ 100
        `8 = ${@test.XP}`
        set [@test @test2].HP *= 2
        `10 = **${@test.HP}** 2 = **${@test2.HP}**`

    enter:
        for i in range(1,10,1):
            set @test3.XP += i
            `XP = ${@test3.XP}`

