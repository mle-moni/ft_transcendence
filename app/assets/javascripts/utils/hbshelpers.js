Handlebars.registerHelper( "when",function(operand_1, operator, operand_2, options) {

    var operators = {
        'eq': function(l,r) { return l == r; },
        'noteq': function(l,r) { return l != r; },
        'gt': function(l,r) { return Number(l) > Number(r); },
        'or': function(l,r) { return l || r; },
        'and': function(l,r) { return l && r; },
        '%': function(l,r) { return (l % r) === 0; }
    }
    , result = operators[operator](operand_1,operand_2);

    if (result) return options.fn(this);
    else  return options.inverse(this);

});

/* Get user attributes by giving a collection, the user_id, the attribute key name */
/* Example : {{#getUserAttributes ../members user_id "image"}} */

Handlebars.registerHelper('getUserAttributes', function(collection, id, attribute) {
    if (!collection || !id || !attribute)
        return null;
    var collectionLength = collection.length;
    for (var i = 0; i < collectionLength; i++) {
        if (collection[i].id === id) {
            return collection[i][attribute];
        }
    }
    return null;
});

Handlebars.registerHelper('ifIn', function(elem, list, options) {
    if (list && list.indexOf(elem) > -1) {
      return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('ifNotIn', function(elem, list, options) {
    if (list && list.indexOf(elem) == -1) {
      return options.fn(this);
    }
    return options.inverse(this);
});

// Or test on 1 boolean + 1 string
Handlebars.registerHelper('ifOr', function(aBoolean, bValue, bTested, options) {

    if (aBoolean || bValue == bTested)
        return options.fn(this);
    return options.inverse(this);
});

Handlebars.registerHelper('ifDm', function(userID, otherUserID, dmRooms, options) {

    if (!userID || !otherUserID || !dmRooms)
        return null;
    for (var count = 0; count < dmRooms.length; count++)
    {
        if ((userID == dmRooms[count].attributes.user1_id
            && otherUserID == dmRooms[count].attributes.user2_id)
            || (userID == dmRooms[count].attributes.user2_id
            && otherUserID == dmRooms[count].attributes.user1_id))
            return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('findDmRoom', function(userID, otherUserID, dmRooms) {

    if (!userID || !otherUserID || !dmRooms)
        return null;
    for (var count = 0; count < dmRooms.length; count++) {
        if ((userID == dmRooms[count].attributes.user1_id
            && otherUserID == dmRooms[count].attributes.user2_id)
            || (userID == dmRooms[count].attributes.user2_id
            && otherUserID == dmRooms[count].attributes.user1_id))
            return dmRooms[count].attributes.id;
    }
    return null;
});

Handlebars.registerHelper('ifCurrentDmRoom', function(userID, otherUserID, dmRooms, thisChatID, options) {

    if (!userID || !otherUserID || !dmRooms || !thisChatID)
        return null;
    for (var count = 0; count < dmRooms.length; count++)
    {
        if ((userID == dmRooms[count].attributes.user1_id
            && otherUserID == dmRooms[count].attributes.user2_id)
            || (userID == dmRooms[count].attributes.user2_id
            && otherUserID == dmRooms[count].attributes.user1_id))
        {
            if (dmRooms[count].attributes.id == thisChatID)
                return options.fn(this);
            else
                return options.inverse(this);
        }
    }
    return options.inverse(this);
});

Handlebars.registerHelper('ifDuelReq', function(isDuelReq, options) {

    if (isDuelReq)
        return options.fn(this);
    return options.inverse(this);
});

Handlebars.registerHelper('ifRanked', function(isRanked, options) {

    if (isRanked)
        return options.fn(this);
    return options.inverse(this);
});

Handlebars.registerHelper('ifCurrentUserRegister', function(userTournamentID, tournamentID, options) {

    if (userTournamentID && tournamentID && userTournamentID == tournamentID)
        return options.fn(this);
    return options.inverse(this);
});

Handlebars.registerHelper('ifTournamentStarted', function(winnerID, started, options) {

    if (winnerID == 0 && !started)
        return options.inverse(this);
    return options.fn(this);
});

Handlebars.registerHelper('findWinner', function(winnerID, allUsers) {

    if (winnerID == -1)
        return ("Nobody");
    for (var count = 0; count < allUsers.length; count++)
    {
        if (allUsers[count].id == winnerID)
            return (allUsers[count].nickname)
    }
});

Handlebars.registerHelper('ifTournamentCanStart', function(TournamentDate, options) {

    if (TournamentDate)
    {
        var tournament = new Date(TournamentDate);
        var now = new Date();
        if (now < tournament)
            return options.inverse(this);
    }
    return options.fn(this);
});

Handlebars.registerHelper('findGuild', function(guilds, userGuildID) {

    if (guilds && userGuildID)
    {
        for (var count = 0; count < guilds.length; count++)
        {
            if (guilds[count].id == userGuildID)
                return (guilds[count].name);
        }
    }
    return (null);
});

Handlebars.registerHelper('findGuildWithUserCollection', function(memberList, guildList, userID) {

    if (memberList && guildList && userID)
    {
        var userGuildID = null;
        for (var count = 0; count < memberList.length; count++)
        {
            if (memberList[count].id == userID)
                userGuildID = memberList[count].guild_id;
        }
        if (!userGuildID) return (null);
        for (var count = 0; count < guildList.length; count++)
        {
            if (guildList[count].id == userGuildID)
                return (guildList[count].name);
        }
    }
    return (null);
});

Handlebars.registerHelper('ifUserHasGuild', function(memberList, userID, options) {

    if (memberList && userID)
    {
        for (var count = 0; count < memberList.length; count++)
        {
            if (memberList[count].id === userID)
            {
                if (memberList[count].guild_id)
                    return options.fn(this);
            }
        }
    }
    return options.inverse(this);
});