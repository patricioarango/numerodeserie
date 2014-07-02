tx.executeSql('select * from usuarios', [], function(tx, rs) {
    for (var i = 0; i < rs.rows.length; i++) {
        var p = rw.rows.item(i);
        alert(p.id + ' ' + p.firstName + ' ' + p.lastName);
    }
}, errorCB);

function errorCB(err) {
        alert("Error processing SQL: "+err);
}