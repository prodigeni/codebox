define([
    'hr/hr',
    'models/box',
    'core/search',
    'core/commands',
    'core/collaborators'
], function (hr, Codebox, search, commands, collaborators) {
    // Current box
    var box = new Codebox();

    // Bind collaborators changement
    box.on("box:users:add", function(e) {
        collaborators.add(e.data);
    });
    box.on("box:users:remove", function(e) {
        collaborators.remove(collaborators.getById(e.data.userId));
    });
    box.on("set", function() {
        collaborators.getCollaborators();
    })

    // Search for files
    search.handler({
        'id': "files",
        'title': "Files"
    }, function(query) {
        var d = new hr.Deferred();
        box.searchFiles(query).done(function(data) {
            d.resolve(_.map(data.files, _.bind(function(path) {
                var filename = _.last(path.split("/"));
                if (filename.length == 0) filename = path;
                return {
                    "text": filename,
                    "callback": _.bind(function() {
                        commands.run("files.open", {
                            'path': path
                        });
                    }, this)
                };
            }, this)));
        });
        return d;
    });

    return box;
});