exports.routes = function (map) {
    map.root('main#root');
    
    map.namespace('users', function(users) {
        users.get('login', 'sessions#new', {as: 'login'});
        users.post('login', 'sessions#create', {as: 'login'});
        users.get('logout', 'sessions#destroy', {as: 'logout'})
    });

    map.all(':controller/:action');
    map.all(':controller/:action/:id');
};