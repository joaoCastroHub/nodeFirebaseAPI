function GrupoCtrl(app, db) {
    this.app = app;
    this.ref = db.ref("restricted_access/secret_document");
}

GrupoCtrl.prototype.criarGrupo = function (grupo, callback) {
    var groupRef = this.ref.child("groups");
    var newKey = groupRef.push().key;
    grupo.id = newKey;
    groupRef.child(newKey + '/info').set(grupo, function () {
        callback(newKey);
    });

}

GrupoCtrl.prototype.buscaGrupo = function (grupo, callback) {
    var groupRef = this.ref.child("groups/" + grupo + "/info");
    
    groupRef.once("value").then(snapshot => {
        callback(snapshot.val());
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        callback(false);
    });
}

GrupoCtrl.prototype.editaGrupo = function (grupo, callback) {
    var groupRef = this.ref.child("groups/" + grupo.id + "/info");
    groupRef.update(grupo, function () {
        callback(true);
    });
}

GrupoCtrl.prototype.deleteGrupo = function (key, callback) {
    var groupRef = this.ref.child("groups");
    groupRef.child(key).remove(function (err, res) {
        if (!err) callback(true);
    });
}

module.exports = function () {
    return GrupoCtrl;
}