// Parsing check for valid names
roles:
    #role1
    #role2

cast:
    @cast1
    @cast2


scenes:
    $test_search:
        interactions:
            ?i1 @cast1 "-1-1" search  @cast2
            ?i2 #role1 "m-m" search #role2
            ?i3 @cast1 "1-m" search #role1
            ?i4 [@cast1 #role1] "m-1" search @cast1
            ?i5 @cast1 "1-m" search [@cast1 #role1]
            ?i6 [@cast1] "1-m" search [@cast1 #role1]  
            ?i7 [@cast1 #role1] "m-m" search [@cast1 #role1]