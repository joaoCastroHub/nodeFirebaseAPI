async = require('async');

function TarefaCtrl(app, db) {
    this.app = app;
    this.ref = db.ref("restricted_access/secret_document/groups");
}

TarefaCtrl.prototype.criarTarefa = function (grupo, tarefa, callback) {
    var userKey = tarefa.idUsuario;
    var tasksRef = this.ref.child(grupo + "/users/" + userKey + "/tasks");

    var newKey = tasksRef.push().key;
    tarefa.id = newKey;

    tasksRef.child(newKey).set(tarefa, function () {
        callback(newKey);
    });
}

TarefaCtrl.prototype.buscaTarefas = function (grupo, usuario, callback) {
    var lista = [];
    var tasksRef = this.ref.child(grupo + "/users/" + usuario + "/tasks");

    return tasksRef.once("value").then(snapshot => {
        snapshot.forEach(function (snap) {
            lista.push(snap.val());
        });
        callback(lista);
    })

}

TarefaCtrl.prototype.editarTarefa = function (grupo, tarefa, callback) {
    var userKey = tarefa.idUsuario;
    var key = tarefa.id;
    var tasksRef = this.ref.child(grupo + "/users/" + userKey + "/tasks/" + key);

    tasksRef.update(tarefa, function () {
        callback(true);
    });
}

TarefaCtrl.prototype.deleteTarefa = function (usuario, tarefa, callback) {
    var userKey = usuario.id;
    var grupo = usuario.idGrupo;
    var tasksRef = this.ref.child(grupo + "/users/" + userKey + "/tasks");
    tasksRef.child(tarefa).remove(function (err, res) {
        callback(true);
    });
}

module.exports = function () {
    return TarefaCtrl;
}