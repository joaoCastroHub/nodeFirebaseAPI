
module.exports = function (app) {
    var db = app.controllers.firebaseConnection.database();
    var admin = app.controllers.firebaseConnection;
    var user = new app.controllers.UsuarioCtrl(app, db, admin);
    var group = new app.controllers.GrupoCtrl(app, db);
    var task = new app.controllers.TarefaCtrl(app, db);
    var item = new app.controllers.ItemCtrl(app, db);
    var bill = new app.controllers.BillCtrl(app, db);
    var bet = new app.controllers.BetCtrl(app, db);
    var pndc = new app.controllers.PendencyCtrl(app, db);

    //LOGIN
    app.get('/login', function (req, res) {
        if (req.session.user) {
            res.send(req.session.user);
        } else {
            res.send(false);
        }
    });

    app.get('/login/sair/:user', function (req, res) {
        var user = req.params.user;
        console.log("chegou: " + user + " = " + req.session.user.id);
        if (user == req.session.user.id) {
            console.log("true");
            req.session.destroy(function (res) {
            });
            res.send(true);
        }

    })

    app.post('/login', function (req, res) {
        var usuario = req.body;
        user.doLogin(usuario, function (callback) {
            req.session.user = callback;
            console.log(callback);
            res.send(callback);
        })
    });

    //GRUPOS
    app.get('/grupo', function (req, res) {
        var grupo = req.session.user.idGrupo;
        group.buscaGrupo(grupo, function (callback) {
            res.send(callback);
        });
    });

    app.post('/grupo', function (req, res) {
        var grupo = req.body;
        group.criarGrupo(grupo, function (callback) {
            res.send(callback);
        });
    });

    app.put('/grupo', function (req, res) {
        var grupo = req.body;
        group.editaGrupo(grupo, function (callback) {
            res.send(callback);
        });
    });

    app.delete('/grupo/delete/:id', function (req, res) {
        console.log("chegou");
        var grupo = req.params.id;
        group.deleteGrupo(grupo, function (callback) {
            res.send(callback);
        });
    });

    //USUARIOS
    app.get('/usuario', function (req, res) {
        var usuario = req.session.user;
        user.buscaUsuarios(usuario.idGrupo, function (callback) {
            res.send(callback);
        });
    });

    app.post('/usuario', function (req, res) {
        var usuario = req.body;
        user.criarUsuario(usuario, function (callback) {
            res.send(callback);
        });
    });

    app.put('/usuario', function (req, res) {
        var usuario = req.body;
        console.log(usuario);
        user.editarUsuario(usuario, function (callback) {
            res.send(callback);
        });
    });

    app.delete('/usuario/delete/:id', function (req, res) {
        var grupo = req.session.user.idGrupo;
        var usuario = req.params.id;
        user.deleteUsuarios(grupo, usuario, function (callback) {
            res.send(callback);
        });
    });

    //TAREFAS
    app.get('/tarefa/user/:id/:grupo', function (req, res) {
        var usuario = req.params.id;
        var grupo = req.params.grupo;
        task.buscaTarefas(grupo, usuario, function (callback) {
            res.send(callback);
        });
    });

    app.post('/tarefa', function (req, res) {
        var tarefa = req.body;
        var grupo = req.session.user.idGrupo;
        task.criarTarefa(grupo, tarefa, function (callback) {
            res.send(callback);
        });
    });

    app.put('/tarefa', function (req, res) {
        var tarefa = req.body;
        var grupo = req.session.user.idGrupo;
        task.editarTarefa(grupo, tarefa, function (callback) {
            res.send(callback);
        });
    });

    app.delete('/tarefa/delete/:id', function (req, res) {
        var tarefa = req.params.id;
        var usuario = req.session.user;
        task.deleteTarefa(usuario, tarefa, function (callback) {
            res.send(callback);
        });
    });

    //ITEMS
    app.get('/item', function (req, res) {
        var grupo = req.session.user.idGrupo;
        item.buscaItens(grupo, function (callback) {
            res.send(callback);
        });
    });

    app.post('/item', function (req, res) {
        var grupo = req.session.user.idGrupo;
        var itm = req.body;
        item.criarItem(grupo, itm, function (callback) {
            res.send(callback);
        });
    });

    app.put('/item', function (req, res) {
        var itm = req.body;
        item.editarItem(itm, function (callback) {
            res.send(callback);
        });
    });

    app.delete('/item/:id', function (req, res) {
        var grupo = req.session.user.idGrupo;
        var itm = req.params.id;
        item.deleteItem(grupo, itm, function (callback) {
            res.send(callback);
        });
    });

    //CONTAS
    app.get('/conta', function (req, res) {
        var grupo = req.session.user.idGrupo;
        bill.buscaContas(grupo, function (callback) {
            res.send(callback);
        });
    });

    app.post('/conta', function (req, res) {
        var grupo = req.session.user.idGrupo;
        var conta = req.body;
        bill.criarConta(grupo, conta, function (callback) {
            res.send(callback);
        });
    });

    app.put('/conta', function (req, res) {
        var conta = req.body;
        bill.editarConta(conta, function (callback) {
            res.send(callback);
        });
    });

    app.delete('/conta/delete/:id', function (req, res) {
        var conta = req.params.id;
        var grupo = req.session.user.idGrupo;
        bill.deleteConta(grupo, conta, function (callback) {
            res.send(callback);
        });
    });

    app.get('/teste', function (req, res) {
        res.send(location.href = "google.com");
    });


    // APOSTA

    app.get('/aposta', function (req, res) {
        var grupo = req.session.user.idGrupo;
        bet.buscaAposta(grupo, function (callback) {
            res.send(callback);
        });
    });

    app.post('/aposta', function (req, res) {
        var grupo = req.session.user.idGrupo;
        var aposta = req.body;
        bet.criarAposta(grupo, aposta, function (callback) {
            res.send(callback);
        });

    });

    app.put('/aposta', function (req, res) {
        var aposta = req.body;
        bet.editaAposta(aposta, function (callback) {
            res.send(callback);
        });
    });

    app.delete('/aposta/delete/:id', function (req, res) {
        var bet = req.params.id;
        var grupo = req.session.user.idGrupo;
        bill.deleteAposta(grupo, bet, function (callback) {
            res.send(callback);
        });
    });

    //pendencia
    app.post('/pendencia', function (req, res) {
        var pend = req.body;
        var grupo = req.session.user.idGrupo;
        pndc.criaPendencia(grupo, pend, function (callback) {
            res.send(callback);
        });
    });

    app.get('/pendencia', function (req,res) {
        var grupo = req.session.user.idGrupo;
        pndc.buscaPendencias(grupo, function(callback) {
            res.send(callback);
        });
    });

    app.put('/pendencia', function(req, res) {
        var usuario = req.session.user;
        var pend = req.body;
        pndc.votar(usuario,pend, function(callback){
            res.send(callback);
        });
    });

    app.delete('/pendencia/delete/:id', function(req, res) {
        var pend = req.params.id;
        var grupo = req.session.user.idGrupo;
        pndc.deletePendencia(grupo, pend, function (callback) {
            res.send(callback);
        });
    });

}