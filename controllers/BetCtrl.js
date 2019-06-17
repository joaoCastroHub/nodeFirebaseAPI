function BetCtrl(app, db) {
    this.app = app;
    this.ref = db.ref("restricted_access/secret_document/groups");
}
     
BetCtrl.prototype.criarAposta = function (grupo, bet, callback) {
    
    var betRef = this.ref.child(grupo + "/bet");
    var newKey = betRef.push().key;
    bet.id = newKey;

    betRef.child(newKey).set(bet, function () {
        callback(bet);
    });
}

BetCtrl.prototype.buscaAposta = function (grupo,callback){
    var aposta = [];
    var key = grupo;
    var betRef = this.ref.child(key + "/bet");
    betRef.once("value").then(snapshot => {
        snapshot.forEach(function (snap) {
            aposta.push(snap.val());
        });
        callback(aposta);
    });
}

BetCtrl.prototype.editaAposta = function (bet, callback) {
    var key = bet.idGrupo;
    var betRef = this.ref.child(key + "/bet/" + bet.id);
    betRef.update(bet, function () {
        callback(true);
    });
}

BetCtrl.prototype.deleteAposta = function (grupo,bet, callback) {
    var betRef = this.ref.child(grupo + "/bet");
    betRef.child(bet).remove(function () {
        callback(true);
    });
}

module.exports = function () {
    return BetCtrl;
}