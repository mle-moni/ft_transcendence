
const DENYACCESS = false;

/* Used to protect :
    - Edit Room
*/

App.utils.assertRoomCurrentUserIsOwnerOrSuperAdmin = (currentUser, room) => {
    if (currentUser == null || room == null)
        return true;
    if (currentUser.admin || currentUser.id == room.owner_id)
        return true;
    return DENYACCESS;
}

/* Used to protect :
    - Admininistrate Room
*/

App.utils.assertRoomCurrentUserIsAdminOrOwnerOrSuperAdmin = (currentUser, room) => {
    if (currentUser == null || room == null)
        return true;
    if (currentUser.admin || currentUser.id == room.owner_id)
        return true;
    x = DENYACCESS;
    room.admins.forEach(adm => {
        if (adm.id == currentUser.id)
            x = true;
    });
    if (x) return x;
    return DENYACCESS;
}

/* Used to protect :
    - Show Room
*/

App.utils.assertRoomCurrentUserIsMember = (currentUser, room) => {
    if (currentUser == null || room == null)
        return true;
    x = DENYACCESS;
    room.members.forEach(mb => {
        if (mb.id == currentUser.id)
            x = true;
    });
    if (x) return x;
    return App.utils.assertRoomCurrentUserIsAdminOrOwnerOrSuperAdmin(currentUser, room);
}

App.utils.assertRoomCurrentUserIsOnlySuperAdmin = (currentUser, room) => {
    if (currentUser == null || room == null)
        return true;
    x = true;
    room.members.forEach(mb => {
        if (mb.id == currentUser.id)
            x = false;
    });
    room.admins.forEach(adm => {
        if (adm.id == currentUser.id)
            x = false;
    });
    if (room.owner_id != currentUser.id && currentUser.admin == true)
        return x; /* Sera à TRUE si non membre, non admin, non owner mais superAdmin */
    return false;
}

