const fs = require('fs');

function UsuarioCrtl(app, db, admin) {
    this.admin = admin;
    this.app = app;
    this.ref = db.ref("restricted_access/secret_document/groups");
}

UsuarioCrtl.prototype.doLogin = function (usuario, callback, next) {
    var groupRef = this.ref;
    var ctrl = false;

    return groupRef.once("value").then(snapshot => {
        snapshot.forEach(function (snap) {
            var usersRef = groupRef.child(snap.key + "/users");
            usersRef.on("value", function (snapS) {
                snapS.forEach(function (users) {
                    var user = users.val();
                    if (user.info.login == usuario.login && user.info.senha == usuario.senha) {
                        ctrl = user.info;
                    }
                });
            });
        });
        callback(ctrl);
    });

}

UsuarioCrtl.prototype.buscaUsuarios = function (grupo, callback) {
    var usuarios = [];
    var key = grupo;
    var usersRef = this.ref.child(key + "/users");
    return usersRef.once("value").then(snapshot => {
        snapshot.forEach(function (snap) {
            usuarios.push(snap.val().info);
        })
        callback(usuarios);
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        callback(false);
    });
}

UsuarioCrtl.prototype.criarUsuario = function (usuario, callback) {
    var key = usuario.idGrupo;
    var usersRef = this.ref.child(key + "/users");

    this.admin.auth().createUser({
        email: usuario.email,
        emailVerified: false,
        // phoneNumber: "+11234567890",
        password: usuario.senha,
        displayName: usuario.nome,
        photoURL: null,
        disabled: false
    })
        .then(function (userRecord) {
            // See the UserRecord reference doc for the contents of userRecord.
            console.log("Successfully created new user:", userRecord.uid);

            usuario.id = userRecord.uid;
            usersRef.child(userRecord.uid + '/info').set(usuario, function () {
                callback(usuario);
            });
        })
        .catch(function (error) {
            console.log("Error creating new user:", error);
            callback(false);
        });
}

UsuarioCrtl.prototype.editarUsuario = function (usuario, callback) {
    if (usuario.file) {
        var base64Data = usuario.file.replace(/^data:image\/[a-z]+;base64,/, "");
        fs.writeFile("./bin/assets/" + usuario.id + ".png", base64Data, 'base64', function (err) {
            console.log("Imagem salva");
        });
    }

    var key = usuario.idGrupo;
    var usersRef = this.ref.child(key + "/users/" + usuario.id + '/info');
    usersRef.update(usuario, function () {
        callback(true);
    });
}

UsuarioCrtl.prototype.deleteUsuarios = function (grupo, user, callback) {
    var usersRef = this.ref.child(grupo + "/users");
    usersRef.child(user).remove(function () {
        callback(true);
    });
}

module.exports = function () {
    return UsuarioCrtl;
}

