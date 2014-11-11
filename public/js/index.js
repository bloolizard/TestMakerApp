var utils = {
    createElement: function(type, className, innerHTML, parent){
        var element = document.createElement(type);
        if (className != ''){element.className = className;}
        element.innerHTML = innerHTML;
        if (typeof parent !== 'undefined' || typeof parent !== null ){parent.appendChild(element);}
        return element;
    }
};

//holds the currentTest
var currentTest = {
    test_name: "",
    questions: []
};

function createAnswer(answer){
//    var p = document.createElement('p');
//    var a1 = document.createElement('p');
//    var opt1 = utils.createElement('input', '', '', a1);
//    opt1.id = 'answer_1';
//    opt1.setAttribute("type", "radio");
//    opt1.setAttribute("name", "answer_for" + question.question);
//    var a1_label = utils.createElement('label','',question.answer_1[1],a1);
//    a1_label.setAttribute('for', opt1.id);
//    answers.appendChild(a1);
}

//draws a question the form :todo
function createQuestion(question){
    var container = document.createElement('div');
    container.className = 'question';
    utils.createElement('h4','',question.question,container);
    var answers = document.createElement('div');


    var a1 = document.createElement('p');
    var opt1 = utils.createElement('input', '', '', a1);
    opt1.id = 'answer_1';
    opt1.setAttribute("type", "radio");
    opt1.setAttribute("name", "answer_for" + question.question);
    var a1_label = utils.createElement('label','',question.answer_1[1],a1);
    a1_label.setAttribute('for', opt1.id);
    answers.appendChild(a1);

    var a2 = document.createElement('p');
    var opt2 = utils.createElement('input', '', '', a2);
    opt2.setAttribute("type", "radio");
    opt2.setAttribute("name", "answer_for" + question.question);
    var a2_label = utils.createElement('label','',question.answer_2[1],a2);
    a2_label.setAttribute('for', opt2.id);
    answers.appendChild(a2);

    var a3 = document.createElement('p');
    var opt3 = utils.createElement('input', '', '', a3);
    opt3.setAttribute("type", "radio");
    opt3.setAttribute("name", "answer_for" + question.question);
    var a3_label = utils.createElement('label','',question.answer_3[1],a3);
    a3_label.setAttribute('for', opt3.id);
    answers.appendChild(a3);

    var a4 = document.createElement('p');
    var opt4 = utils.createElement('input', '', '', a4);
    opt4.setAttribute("type", "radio");
    opt4.setAttribute("name", "answer_for" + question.question);
    var a4_label = utils.createElement('label','',question.answer_1[1],a4);
    a4_label.setAttribute('for', opt4.id);
    answers.appendChild(a4);

    container.appendChild(answers);
    return container;



}

//need a function for grading test :todo

function getAjax(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/tests');
    xhr.addEventListener('readystatechange', function(){
        if (xhr.status === 200 && xhr.readyState === 4){
            callback(xhr.responseText);
        }
    });
    xhr.send();
}

function createTest(callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/tests');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('readystatechange', function(){
        if ( xhr.status === 200 && xhr.readyState === 4){
            callback(xhr.responseText);
        }
    });
    xhr.send(JSON.stringify(currentTest));


}

function updateTest(form_object, callback){
    var test_id = (document.getElementById('test_name')).getAttribute('data-id');
    var xhr = new XMLHttpRequest();
    xhr.open('PUT','/tests/' + test_id);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.addEventListener('readystatechange', function(){
        if (xhr.status === 200 && xhr.readyState === 4){
            callback(xhr.responseText);
        }
    });
    xhr.send(JSON.stringify(form_object));
}

function displayTests(title, id){
    var my_tests = document.getElementById('my_tests');
    var p = utils.createElement('p', '','', my_tests);
    var a = utils.createElement('a','',title, p);
    a.setAttribute('data-id', id);
    a.href = "#";
    a.addEventListener('click', function(e){
        e.preventDefault();
        getTest(id, function(data){
            createTestView(JSON.parse(data));
        });
    })
}

// shows the test
function getTest(id, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/tests/'+ id);
    xhr.addEventListener('readystatechange', function(){
        if (xhr.status === 200 && xhr.readyState === 4){
            callback(xhr.responseText);
        }
    });
    xhr.send();
}

// create a test for user
function createTestView(test_object){
    console.log(test_object);

    // hide my tests
    router.views['/my_test'].element.style.display = 'none';

    router.show('/test_view', 'other_views');

    //append title to test view
    var test_view = document.getElementById('test_view');
    var test_title = utils.createElement('div','test_title',
        test_object[0].test_name, test_view);

    test_object[0].questions.forEach(function(question){

        // create an element for each question
        test_view.appendChild(createQuestion(question));

    });
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
        }

    };

    this.other_views = {
        '/create_question':{
        trigger: [document.getElementById('create_question_trigger')],
        element: document.getElementById('create_question_container'),
        init: [],
        unload: []
        },
        '/test_view':{
            trigger:[],
            element: document.getElementById('test_view'),
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
                self.views[view].unload.forEach(function(fn){
                    fn();
                });

                // hide all of the other views
                self.views[view].element.style.display = 'none';
                self.other_views['/test_view'].element.style.display = 'block';


            }

            //hide question box if its showing
            self.other_views['/create_question'].element.style.display = 'none';


            //show the new view
            self.views[path].element.style.display = 'block';
        }
        else if (list == 'other_views') {
            for (var view in self.other_views){
                self.other_views[view].unload.forEach(function(fn){
                    fn();
                });

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

                //initialize functions
                self.views[path].init.forEach(function(fn){
                    fn();
                });

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
          // take you to create question view
        self.show(self.other_views['/create_question'].trigger[0].dataset.href, 'other_views');

        //save the test name
        currentTest.test_name = document.getElementsByName('test_name')[0].value;
        // disable test button
        (document.getElementById('create_question_trigger')).disabled = true;

//        createTest(function(data){
//            self.show(self.other_views['/create_question'].trigger[0].dataset.href, 'other_views');
//
//            var test_data = JSON.parse(data);
//            console.log(test_data._id);
//
//            //lock the create test btn
//            (document.getElementById('create_question_trigger')).disabled = true;
//            (document.getElementsByName('test_name')[0]).disabled = true;
//
//            //append id as data attribute on container
//            (document.getElementById('test_name')).setAttribute('data-id', test_data._id);
//        });
    });


}

var router = new Router();

function setTestTemplateView(){



    //draw questions in new container below
    var test_template = document.getElementById('test_template');

    //clear out the before redraw
    test_template.innerHTML = '';


    utils.createElement('h1', '', currentTest.test_name, test_template);


    //for each question draw a question box;
    currentTest.questions.reverse().forEach(function(elem){
        console.log(elem);
        var question_div = utils.createElement('div', 'question','', test_template);
        utils.createElement('h4', '',elem.question, question_div);
        utils.createElement('span', elem.answer_1[0] ? 'correct' : '', elem.answer_1[1], question_div);
        utils.createElement('span', elem.answer_2[0] ? 'correct' : '', elem.answer_2[1], question_div);
        utils.createElement('span', elem.answer_3[0] ? 'correct' : '', elem.answer_3[1], question_div);
        utils.createElement('span', elem.answer_4[0] ? 'correct' : '', elem.answer_4[1], question_div);

    });

    test_template.style.display = 'block';
}

//get question object from form
function getQuestionObject(){
    var form = document.forms.create_question_form;
    return {
        question: form.question.value,
        answer_1: [form.answers[0].checked, form.opt0.value],
        answer_2: [form.answers[1].checked, form.opt1.value],
        answer_3: [form.answers[2].checked, form.opt2.value],
        answer_4: [form.answers[3].checked, form.opt3.value]
    }
}

//adding a question
document.getElementById('add_question').addEventListener('click', function() {
    //adds new questions below container
    console.log('Add Questions');

    //save the the question in an object
    currentTest.questions.push(getQuestionObject());
    console.log(currentTest);

    document.forms.create_question_form.reset();

    setTestTemplateView();
});

// when the test is finished press this
document.getElementById('finish_test_template').addEventListener('click', function(){
    console.log('Thank you for making a test');

    //hide the test view if its showing
    document.getElementById('test_template').style.display = 'none';

    //send the test object over
    createTest(function(){
        //clear currentTest Object
        currentTest = {};

        //alert user of complete Test
        alert('Thank you for your test =)');


        //redirect user to My Tests
        router.show('/my_test', 'views');
        router.views['/my_test'].init.forEach(function(fn){
            fn();
        });
    });
});

router.views['/new_test'].unload.push(function(){
});

router.views['/my_test'].init.push(function(){
    console.log('My Test Opened');
    //get test objects from server
    getAjax(function(data){
       var _data = JSON.parse(data);
       console.log(_data);

       for (var test in _data){
            //display created tests
            displayTests(_data[test].test_name,_data[test]._id );
       }
        //randomize test order
    });

});

router.views['/my_test'].unload.push(function(){
    (document.getElementById('my_tests')).innerHTML = '';
});