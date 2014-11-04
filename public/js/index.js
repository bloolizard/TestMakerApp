var utils = {
    createElement: function(type, className, innerHTML, parent){
        var element = document.createElement(type);
        if (className != ''){element.className = className;}
        element.innerHTML = innerHTML;
        if (typeof parent !== 'undefined'){parent.appendChild(element);}
        return element;
    }
};


function createTest(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tests');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('readystatechange', function(){
        if ( xhr.status === 200 && xhr.readyState === 4){
            callback(xhr.responseText);
        }
    });
    var test = {test_name: document.getElementsByName('test_name')[0].value};
    if (test.test_name != ''){
        xhr.send(JSON.stringify(test));
    }

}

function updateTest(callback){
    var test_id = (document.getElementById('test_name')).getAttribute('data-id');
    console.log(test_id);
    var xhr = new XMLHttpRequest();
    xhr.open('PUT','/tests/' + test_id);
    xhr.addEventListener('readystatechange', function(){
        if (xhr.status === 200 && xhr.readyState === 4){
            callback(xhr.responseText);
        }
    });
    xhr.send();
}


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
        },

    };

    this.other_views = {
        '/create_question':{
        trigger: [document.getElementById('create_question_trigger')],
        element: document.getElementById('create_question_container'),
        init: [],
        unload: []
        }
    };

    this.path = '/welcome';

    var self = this;

    this.show = function(path, list){
        this.path = path;
        console.log(path);

        if (list == 'views'){
            for (var view in self.views){
                // hide all of the other views
                self.views[view].element.style.display = 'none';

            }
            //show the new view
            self.views[path].element.style.display = 'block';
        }
        else if (list == 'other_views') {
            for (var view in self.other_views){
                // hide all of the other views
                self.other_views[view].element.style.display = 'none';
            }
            //show the new view
            self.other_views[path].element.style.display = 'block';

        }



    };
    //hide all views by default
    for (var view in self.views){
        self.views[view].element.style.display = 'none';

        // add event listeners on triggers
        self.views[view].trigger.forEach(function(trigger){
            trigger.addEventListener('click', function(e){
                e.preventDefault();
                var path = trigger.dataset.href;
                self.show(path, 'views');

            });
        });

    }

    //also hide all views in other_view
    for (var view in self.other_views){
        self.other_views[view].element.style.display = 'none';
    }



    //show welcome container to start
    self.views['/welcome'].element.style.display = 'block';

    self.other_views['/create_question'].trigger[0].addEventListener('click',function(e){
        createTest(function(data){
            self.show(self.other_views['/create_question'].trigger[0].dataset.href, 'other_views');

            var test_data = JSON.parse(data);
            console.log(test_data._id);

            //lock the create test btn
            (document.getElementById('create_question_trigger')).disabled = true;
            (document.getElementsByName('test_name')[0]).disabled = true;

            //append id as data attribute on container
            (document.getElementById('test_name')).setAttribute('data-id', test_data._id);
        });
    });


}

var router = new Router();

//adding a question
document.getElementById('add_question').addEventListener('click', function() {
    updateTest(function(){

    });
});