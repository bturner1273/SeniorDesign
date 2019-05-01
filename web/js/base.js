var notify = (function () {
    var suc, err;
    suc = function (txt, timeout, manualClose) {
        var n = new Noty({
            text: "<b>" + txt + "</b>", type: "success", layout: "topCenter"
        }).show();
        setTimeout(function () {n.close();}, timeout === undefined ? 2000 : timeout);
    }
    err = function (txt, timeout, manualClose) {
        var n = new Noty({
            text: "<b>" + txt + "</b>", type: "success", layout: "topCenter"
        }).show();
        setTimeout(function () {n.close();}, timeout === undefined ? 3000 : timeout);
    }
    return{
        suc: suc,
        err: err
    }
})();
