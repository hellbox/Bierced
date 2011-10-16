$(document).ready(function() {
	
/* FUNCTIONS */

	function showChapter( chapter, callback ) { //use callback for forcing URL for reloads
		clearDisplay(); //clear current selection
		var sortArray = [];
		for (i = 0; i < localStorage.length; i++) {
			//make sure item is not a letter but an actual item
			if (localStorage.getItem(localStorage.key(i)) != localStorage.key(i) && localStorage.key(i)[0] === chapter) {	
				sortArray.push(localStorage.key(i));
			}
		}
		sortArray.sort();
		for (i = 0; i < sortArray.length; i++) {
			try //if the content of the key isn't JSON, catch the error and ignore the item			
			{
				if (JSON.parse(localStorage.getItem(sortArray[i])).entry === true) {
					if (JSON.parse(localStorage.getItem(sortArray[i])).fave) {
						$('#display').append('<h2 id="' + sortArray[i] + '">' + sortArray[i] + ' <a href="#" class="fave">unfave</a></h2>' + JSON.parse(localStorage.getItem(sortArray[i])).content);
					} else {
						$('#display').append('<h2 id="' + sortArray[i] + '">' + sortArray[i] + ' <a href="#" class="fave">fave</a></h2>' + JSON.parse(localStorage.getItem(sortArray[i])).content);
					}
				}
			}
			catch(err)
			{
				console.log(err);
			}
		}
		if (callback) {
			window.location.hash = callback;
		}
		//Navigation highlights
		$('#' + chapter).addClass('selected');
		$('.fave').bind('click', 
		function( e ){
			updateFave( $(this).parent()[0].id);
			e.preventDefault();
		})
	}


    function clearDisplay() {
        $('#display').html('');
        //remove current selection's content				
        $('#nav li a').each(function() {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }

        })
    }


    function init() {
        indexMaker(bookData);
        if (window.location.hash) {
            //see if an item is already selected
            showChapter(window.location.hash.substr(1)[0], window.location.hash.substr(1));
        }
        importData();
    }


    function indexMaker(array) {
        //clumsy to load everything into an array and then just use it only for sorting, but there you go. 			
        var sortArray = [];
        for (i = 0; i < localStorage.length; i++) {
            if (localStorage.getItem(localStorage.key(i)) === localStorage.key(i)) {
                //find only letters
                sortArray.push(localStorage.key(i));
            }
        }
        sortArray.sort();
        for (i = 0; i < sortArray.length; i++) {
            $('ul#nav').append('<li><a href="#' + sortArray[i] + '" id="' + sortArray[i] + '">' + sortArray[i] + '</a></li>');
        }
    }


    function importData(override) {
        if (!localStorage.getItem('version') || override === 'true') {
            localStorage.setItem('version', bookData[0].version);
            localStorage.setItem('title', bookData[0].title);
            localStorage.setItem('author', bookData[0].author);

            //loop through and load the book here
            $(bookData[0].chapters).each(function(index) {
                localStorage.setItem(this.name, this.name);
                $(bookData[0].chapters[index].content).each(function() {
                    var setJSONKey = {
                        'content': this.content,
                        'fave': 0,
                        'entry': true
                    };
                    localStorage.setItem(this.entry, JSON.stringify(setJSONKey));
                });
            });
        } else if (localStorage.getItem('version') === bookData[0].version) {
            return;
        } else {
            overwriteLocalData();
            return;
        }
    }


    function updateFave(item) {
		var tempValue = JSON.parse(localStorage.getItem(localStorage.key(item)));
		if(tempValue.fave){
			tempValue.fave = 0;				
			$('#' + item + ' a').text('fave');
			console.log( tempValue.fave + ' 0');
		}else{
			tempValue.fave = 1;
			$('#' + item + ' a').text('unfave');
			console.log( tempValue.fave + ' 1');
		}
		localStorage.setItem(item, JSON.stringify(tempValue));	
    }

    function overwriteLocalData() {
        importData('true');
    }

    function putData(key, value) {
        localStorage.setItem(key, value);
    }

    function matchSearch(value) { //Displays and handles clicks on quick-search items
        $('ul#results').css('display', 'block');
        $('ul#results').html('');
        //clear current results
        if (value.length > 0) {
            //don't trigger on keyup from backspacing and clearing value
			var chapterTitle;
            for (i = 0; i < localStorage.length; i++) {
                if (value === localStorage.key(i).slice(0, value.length)) {
					if(localStorage.key(i) === localStorage.key(i).slice(0, value.length)){
						chapterTitle = localStorage.key(i);
					}else{
						try
						{
						 	if(JSON.parse(localStorage.getItem(localStorage.key(i))).entry){ //make sure the item has a JSON value, or it's not an entry to be listed
								$('ul#results').append('<li><a href="#' + localStorage.key(i) + '" class="deflink">' + localStorage.key(i) + '</a></li>');		
							}	
						}
						catch( err ){}
						
					}                    
                }
            }
			$('ul#results').prepend('<li><a href="#' + chapterTitle + '" class="deflink chapter">' + 'All &lsquo;' + chapterTitle.toUpperCase() + '&rsquo; definitions</a></li>');	
        }
        $('.deflink').click(function( e ) {
			showChapter(this.hash.substr(1).charAt(0), this.hash.substr(1));
			
        })
    }


    init();


/* EVENT HANDLERS */

    $('#nav a').click(function( e ) {
        //chapter selection handler
		console.log(chapterTitle);
        var that = this.text;
        showChapter(that, that);
    });


    $('#terms').bind('keyup',
    function(event) {
        matchSearch(event.target.value);
        this.clear;
    })

    $('body').bind('click',
    function( e ) {
        $('#terms')[0].value = '';
        $('ul#results').css('display', 'none');
		e.preventDefault();
    })


});
