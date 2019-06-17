function ItemCrtl(app, db) {
    this.app = app;
    this.ref = db.ref("restricted_access/secret_document/groups");
}

ItemCrtl.prototype.buscaItens = function (grupo, callback) {
    var itemRef = this.ref.child(grupo + "/items");
    var items = [];
    itemRef.once("value").then( snapshot => {
        snapshot.forEach(function(snap) {
            items.push(snap.val());
        });
        callback(items);
    });
}

ItemCrtl.prototype.criarItem = function (grupo, item, callback) {
    var itemRef = this.ref.child(grupo + "/items");

    var newKey = itemRef.push().key;
    item.id = newKey;

    itemRef.child(newKey).set(item, function () {
        callback(newKey);
    });
}

ItemCrtl.prototype.editarItem = function (item, callback) {
    var key = item.idGrupo;
    var itemRef = this.ref.child(key + "/items/" + item.id);

    itemRef.update(item, function (){
        callback(true);
    });
}

ItemCrtl.prototype.deleteItem = function (grupo,item, callback) {
    var usersRef = this.ref.child(grupo + "/items");
    usersRef.child(item).remove(function () {
        callback(true);
    });
}


module.exports = function () {
    return ItemCrtl;
}
