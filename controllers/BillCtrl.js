function BillCtrl(app, db) {
    this.app = app;
    this.ref = db.ref("restricted_access/secret_document/groups");
}

BillCtrl.prototype.buscaContas = function (grupo, callback) {
    var contaRef = this.ref.child(grupo + "/bills");
    var contas = [];
    contaRef.once("value").then( snapshot => {
        snapshot.forEach(function(snap) {
            contas.push(snap.val());
        });
        callback(contas);
    });

}

BillCtrl.prototype.criarConta = function (grupo, conta, callback) {
    var contaRef = this.ref.child(grupo + "/bills");

    var newKey = contaRef.push().key;
    conta.id = newKey;

    contaRef.child(newKey).set(conta, function () {
        callback(newKey);
    });
}

BillCtrl.prototype.editarConta = function (conta, callback) {
    var key = conta.idGrupo;
    var contaRef = this.ref.child(key + "/bills/" + conta.id);

    contaRef.update(conta, function () {
        callback(true);
    });

}

BillCtrl.prototype.deleteConta = function (grupo, conta, callback){
    var contaRef = this.ref.child(grupo + "/bills");
    contaRef.child(conta).remove(function(){
        callback(true);
    });
}

module.exports = function () {
    return BillCtrl;
}