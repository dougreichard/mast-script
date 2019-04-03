
/*
In this scene the hotel represents a wrecked spaceship. We set 2 beacons plus some virtual terrain throughout the wreck. 
The terrain forms a virtual maze to challenge them.
Beacon #1 is the ship's black box which the players must find and recover.
Beacon #2 represents piranha eggs. 
If any player disturbs the eggs that beacon will notify me and I will have a swarm of piranha attack their ship. ('see below')

I'd like to program AR terrain in the app such as closed doors in the hotel's hallways. 
A spaceship would have bulkheads with doors in the corridors to contain leaks but 
the hotel corridors are open from end to end. Could the app simulate doors? 
That is, when any player reaches certain points within the hotel the app 
tells them they have reached a closed door, they must click a button on their app to open the door. 
If one player opens door B2 then all players should see that B2 is open.

Most doors are ordinary, just click and walk through.
Some doors will lead to hull breached corridors in vacuum. The app will warn them of this. 
If they open such a door alarms will shriek and the LARP GM will yell at them to close the door.
Other doors lead to corridors that are temporarily safe but hull breach is imminent. 
If players enter one of these they see a timer warning them how long they have before the hull blows. 
After it blows they must find another route to come back.
The piranha eggs are in a safe place, but if a player disturbs them the piranhas eat their way out of the ship, 
ripping through the hull and creating a breached area. The players musty get out fast.

Chapters 2 onward
In Chapter 2 the hotel represents Behemoth Bob's Barber College and Starship School. 
The ballroom is the Starship School. The players need to find Behemoth Bob in the ballroom.

In the other chapters the players need to find their way around seedy space stations that 
are wretched hives of scum and villainy.

Can the app help with this?
*/

roles:
    #safe ('Safe door') ``
    #breach ('Door with breach') ``
    #awayteam ('Away team member') ``

cast:
    @bank ('Banker') `A way to get money`
    @blackbox ('Unknown Signal one') #prop `A beacon near the creah site` 
    @eggs ('Unknown Signal two') #prop `A beacon near the crash site`
    @b1d1 ('Door one')  #safe `Example door bulkhead two`
    @b1d2 ('Door two')  #safe `Example door bullkhead one`
    @b2d1 ('Door one') #breach `Example door`
    @b2d2 ('Door two')  #safe `Example door`
    @b2d3 ('Door three')  #safe `Example door`
    @b3d1 ('Door one')  #safe `Example door`
    @b3d2 ('Door two')  #safe `Example door`


// these are things always available
story:
    interactions:
        interaction ?money `send money`:
            form:
                label `user: {{@from.name}} is asking ${{@from.amount}} send?`
                select choice:
                    yes
                    no
                submit 'Submit'
            if amount > 100:
                tell @host `too much`
            else choice is yes:
                set @from.amount +=  amount
                complete

        interaction #awayteam `Request Money`:
            form:
                input amount `How much?`
                submit 
            if:
                ask ?money @host
                // Data is sent too

        interaction #awayteam `Wallet`:
            form:
                label `You have ${{@to.amount}}`


    startup:
        set #awayteam.amount: 100

scenes:
    
    $bulkheadone ('b1') ` `:
        startup:
            tell #awayteam `This is nicer`

    $bulkheadtwo ('b2') ``

    $bulkheadthree ('b3') ``



