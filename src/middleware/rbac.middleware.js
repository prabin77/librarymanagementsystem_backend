const isAdmin = async(req, res, next) => {
    let user = req.authUser;
    if(!user) {
        next({
            status: 401, msg: "Please login first"
        })
    } else {
        if(user.role === 'admin') {
            next()
        } else {
            next({
                status: 403, msg: "Access denied"
            })
        }
    }
}
const isTeacher = async(req, res, next) => {
    let user = req.authUser;
    if(!user) {
        next({
            status: 401, msg: "Please login first"
        })
    } else {
        if(user.role === 'seller') {
            next()
        } else {
            next({
                status: 403, msg: "Access denied"
            })
        }
    }
}

const isStudent = async(req, res, next) => {
    let user = req.authUser;
    if(!user) {
        next({
            status: 401, msg: "Please login first"
        })
    } else {
        if(user.role === 'customer') {
            next()
        } else {
            next({
                status: 403, msg: "Access denied"
            })
        }
    }
}

const isAdminOrTeacher = async(req, res, next) => {
    let user = req.authUser;
    if(!user) {
        next({
            status: 401, msg: "Please login first"
        })
    } else {
        if(user.role === 'admin' || user.role === 'teacher') {
            next()
        } else {
            next({
                status: 403, msg: "Access denied"
            })
        }
    }
}

const checkPermission = (role) => {
    return (req, res, next) => {
        let user = req.authUser;
        if(!user) {
            next({
                status: 401, msg: "Please login first"
            })
        } else {

            if(Array.isArray(role)) {
                // role is an array
                if(role.includes(user.role)){
                    next();
                } else {
                    next({status: 403, msg: "Access denied"})
                }
            } else {
                if(user.role === role){
                    next()
                } else {
                    next({status: 403, msg: "Access denied"})
                }
            }
        }
    }
}

module.exports = {
    isAdmin,
    isTeacher,
    isAdmin, 
    isAdminOrTeacher,
    checkPermission
}