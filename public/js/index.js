function Router(){
    this.views = {
        '/welcome': {
            trigger: [document.getElementById('welcome_trigger')],
            element: document.getElementById('welcome_container'),
            init: [],
            unload: []
        },
        '/new_test': {
            trigger: [document.getElementById('new_test_trigger'),
                        document.getElementById('new_test_btn')],
            element: document.getElementById('new_test_container'),
            init: [],
            unload: []
        },
        '/my_test': {
            trigger: [document.getElementById('my_test_trigger'),
                    document.getElementById('my_test_btn')],
            element: document.getElementById('my_test_container'),
            init: [],
            unload: []
        }
    };

    this.path = '/welcome';

    var self = this;

    this.show = function(path){
        this.path = path;
        console.log(path);
        self.views[path].element.style.display = 'block';

    };

    for (var view in self.views){
        self.views[view].element.style.display = 'none';

        // add event listeners on triggers
        self.views[view].trigger.forEach(function(trigger){
            trigger.addEventListener('click', function(e){
                e.preventDefault();
                var path = trigger.dataset.href;
                self.show(path);
            });
        });

    }

    //show welcome container to start
    self.views['/welcome'].element.style.display = 'block';


}

var router = new Router();