$(function() {
    //Gets the user's to-do list when they open the extension
    chrome.storage.sync.get('list', function(tasks) {
        if(tasks.list) {
            tasks.list.forEach(element => {
                //Adds each item from stored array into UI
                $('#taskList').append("<tr><td>" + element + "</td><td><input type='button' id='remove' value='X'></td></tr>");
            });
            if(tasks.list.length == 0) {
                $('#header').text('To-do List (You\'re all done!):');
            } else if(tasks.list.length == 1) {
                $('#header').text('To-do List (1 task remaining):');
            } else {
                $('#header').text('To-do List (' + tasks.list.length + ' tasks remaining):');
            }
        }
    });

    //When the user presses "Add"
    $('#add').click(function() {
        chrome.storage.sync.get('list', function(tasks) {
            var taskList = [];
            
            //If the list already exists in storage, then copy it
            if(tasks.list) {
                taskList = tasks.list;
            }
            
            var newTask = $('#task').val();
            //If the user entered a value into the field 
            //(i.e. field is not empty)
            if(newTask) {
                taskList.push(newTask);

                //Adds the new item to the UI (the table)
                $('#taskList').append("<tr><td>" + newTask + "</td><td><input type='button' id='remove' value='X'></td></tr>");
                
                //Updates UI to match number of tasks remaining
                if(taskList.length == 1) {
                    $('#header').text('To-do List (1 task remaining):');
                } else {
                    $('#header').text('To-do List (' + taskList.length + ' tasks remaining):');
                }
            }

            chrome.storage.sync.set({'list': taskList});

            //Clears the input area
            $('#task').val('');
        });
    });

    //When the user click "Clear"
    $('#clear').click(function() {
        //Empties the array
        chrome.storage.sync.clear();
        //Empties the <ul> to reflect empty to-do list
        $('#taskList').empty();
        $('#header').text('To-do List (You\'re all done!):');
    });

    //When the user clicks on an 'X' button next to a task
    $('table').on('click', 'input[type="button"]', function(e){
        //"index" represents the row number in the table of the task
        var index = $(this).closest('tr').rowIndex;

        //Deletes the corresponding task
        $(this).closest('tr').remove();

        chrome.storage.sync.get('list', function(tasks) {
            var taskList = [];
            
            //If the list already exists in storage, then copy it
            if(tasks.list) {
                taskList = tasks.list;
            }
            taskList.splice(index, 1);

            //Updates number of tasks remaining text in UI
            if(taskList.length == 0) {
                $('#header').text('To-do List (You\'re all done!):');
            } else if(taskList.length == 1) {
                $('#header').text('To-do List (1 task remaining):');
            } else {
                $('#header').text('To-do List (' + taskList.length + ' tasks remaining):');
            }

            //Stores updated to-do list into storage
            chrome.storage.sync.set({'list': taskList});
        });
     });
});