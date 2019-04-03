/*
How will you handle this?
*choice
  #Try to talk them out of it.
    They cannot be dissuaded.
    *finish
  #Force them to relent.
    They back down, for now.
    *finish
  *selectable_if (president) #Abuse my presidential powers to silence them
    This works; you will never hear from them again.
    *finish
*/
$example 'How will you handle this?':
    interactions:
        ?A story "How will you handle this?" choice:
            'Try to talk them out of it':
              tell 'They cannot be dissuaded.'
              scene story
            'Force then to relent':
              tell 'They cannot be dissuaded.'
              scene story
            #president 'Abuse my presidential powers to silence them':
              tell 'This works; you will never hear from them again.'
              scene story

            