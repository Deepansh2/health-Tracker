exports.userResponse = (users) =>{

    userResult = [];

    users.forEach(user=>{
        userResult.push({
            name : user.name,
            email : user.email,
            userId : user.userId,
            userType: user.userType,
            userStatus:user.userStatus
        })
    });
    return userResult;
}