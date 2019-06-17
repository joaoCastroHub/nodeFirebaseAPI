function PendencyCtrl(app, db) {
    this.app = app;
    this.ref = db.ref("restricted_access/secret_document/groups");
}

PendencyCtrl.prototype.criaPendencia = function (grupo, pendencia, callback) {
    var ctrl = true;
    var pendRef = this.ref.child(grupo + "/pendencies");
    var newKey = pendRef.push().key;
    pendencia.idGrupo = grupo;
    pendencia.id = newKey;

    // verifica se ja existe
    pendRef.once("value").then(snapshot => {
        snapshot.forEach(function (snap) {
            var pnd = snap.val();
            if (pnd.tarefa.id == pendencia.tarefa.id) {
                ctrl = false;
            }
        });

        if (ctrl) {
            pendRef.child(newKey).set(pendencia, function () {
                callback(pendencia);
            });
        } else {
            callback("Pendencia ja cadastradad!");
        }
    });

}

PendencyCtrl.prototype.buscaPendencias = function (grupo, callback) {
    var pendRef = this.ref.child(grupo + "/pendencies");
    var pendencias = [];

    pendRef.once("value").then(snapshot => {
        snapshot.forEach(function (snap) {
            pendencias.push(snap.val());
        });
        callback(pendencias);
    })
}

PendencyCtrl.prototype.votar = function(user, pendencia, callback){
    var pendRef = this.ref.child(user.idGrupo + "/pendencies/" + pendencia.id);
    pendRef.update(pendencia, function(){
        callback(true);
    });
}

PendencyCtrl.prototype.deletePendencia = function(grupo, pend, callback){
    var pendRef = this.ref.child(grupo + "/pendencies");
    pendRef.child(pend).remove(function () {
        callback(true);
    });
}

module.exports = function () {
    return PendencyCtrl;
}