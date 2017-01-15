$(document).ready(function() {
	
/* FUNCTIONS */
	function showChapter( chapter, callback ) { //use callback for forcing URL for reloads
		chapter = chapter.toLowerCase();
		callback = callback.toLowerCase();
		clearDisplay(); //clear current selection				
		var sortArray = [];
		for (var i = 0; i < localStorage.length; i++) {
			//make sure item is not a letter but an actual item
			if (localStorage.getItem(localStorage.key(i)).toLowerCase() != localStorage.key(i).toLowerCase() && localStorage.key(i)[0].toLowerCase() === chapter) {	
				sortArray.push(localStorage.key(i));
			}
		}		
		sortArray.sort();		
		for (var i = 0; i < sortArray.length; i++) {

			try //if the content of the key isn't JSON, catch the error and ignore the item			
			{
				if (JSON.parse(localStorage.getItem(sortArray[i])).entry === true) {
					if (JSON.parse(localStorage.getItem(sortArray[i])).fave) {
						$('#display').append('<h2 id="' + encodeURIComponent(sortArray[i]) + '">' + sortArray[i] + ' <a href="#" class="fave">unfave</a></h2>' + JSON.parse(localStorage.getItem(sortArray[i])).content);
					} else {											
						$('#display').append('<h2 id="' + encodeURIComponent(sortArray[i]) + '">' + sortArray[i] + ' <a href="#" class="fave">fave</a></h2>' + JSON.parse(localStorage.getItem(sortArray[i])).content);
					}
				}
			}
			catch(err)
			{
			}			
		}
		if (callback) {
			window.location.hash = callback;
		}
		//Navigation highlights
		$('#' + chapter).addClass('selected');
		$('.fave').bind('click', 
		function( e ){
			updateFave( $(this).parent()[0].id );
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
		localStorage.clear();
	    importData('true');
        if (window.location.hash) {
            //see if an item is already selected
           showChapter(window.location.hash.substr(1)[0], window.location.hash.substr(1));
        }
    }

    function indexMaker(array) {
        //clumsy to load everything into an array and then just use it only for sorting, but there you go. 			
        var sortArray = [];
        for (var i = 0; i < localStorage.length; i++) {
            if (localStorage.getItem(localStorage.key(i)).toLowerCase() === localStorage.key(i).toLowerCase() ) {

                //find only letters
                sortArray.push(localStorage.key(i));
            }
        }
        sortArray.sort();
        for (var i = 0; i < sortArray.length; i++) {
            $('ul#nav').append('<li><a href="#' + encodeURIComponent(sortArray[i]) + '" id="' + sortArray[i] + '">' + sortArray[i] + '</a></li>');
        }
    }

	function importData(override) {
		if (!localStorage.getItem('version') || override === 'true') { //data not loaded
			localStorage.setItem('version', bookData[0].version);
			localStorage.setItem('title', bookData[0].title);
			localStorage.setItem('author', bookData[0].author);
			
			//loop through and load the book here
			$(bookData[0].chapters).each(function(index) {
				localStorage.setItem(this.name, this.name);
				$(bookData[0].chapters[index].content).each(function() {					
					var setJSONKey = {
						'content': this.content,
						'article' : this.article,
						'fave': 0,
						'entry': true
					};
					localStorage.setItem(this.entry, JSON.stringify(setJSONKey));
				});

			});
		} else if (localStorage.getItem('version') === bookData[0].version) { //data has not changed since last load
			indexMaker(bookData);
			return;
		} else { //data has changed since last load, reload
			overwriteLocalData();
			return;
		}
		indexMaker(bookData);
	}

    function updateFave(item) {
		var tempValue = JSON.parse(localStorage.getItem(item));
		if(tempValue.fave === 0){
			tempValue.fave = 1;
			
			$('#' + encodeURIComponent(item) + ' a').text('unfave');
		}else{
			tempValue.fave = 0;
			$('#' + encodeURIComponent(item) + ' a').text('fave');
		}
		localStorage.setItem( item, JSON.stringify(tempValue));		
    }

    function overwriteLocalData() {
		localStorage.clear();
        importData('true');
    }

	function spaceToUnderline( space ){
		space.replace('\s' ,'_');
		return space
	}

    function matchSearch(value) { //Displays and handles clicks on quick-search items
        $('ul#results').css('display', 'block');
        $('ul#results').html('');
        //clear current results
		value = value.toLowerCase();
        if (value.length > 0) {
            //don't trigger on keyup from backspacing and clearing value
			var chapterTitle;
            for (var i = 0; i < localStorage.length; i++) {
                if (value === localStorage.key(i).slice(0, value.length).toLowerCase()) {
					if(localStorage.key(i).toLowerCase() === localStorage.key(i).slice(0, value.length).toLowerCase()){
						chapterTitle = localStorage.key(i);
					}else{
						try
						{
						 	if(JSON.parse(localStorage.getItem(localStorage.key(i))).entry){ //make sure the item has a JSON value, or it's not an entry to be listed
								$('ul#results').append('<li><a href="#' + encodeURIComponent(localStorage.key(i).toLowerCase()) + '" class="deflink">' + localStorage.key(i).toLowerCase() + '</a></li>');		
							}	
						}
						catch( err ){}
						
					}                    
                }
            }
			$('ul#results').prepend('<li><a href="#' + encodeURIComponent(chapterTitle) + '" class="deflink chapter">' + 'All &lsquo;' + chapterTitle.toUpperCase() + '&rsquo; definitions</a></li>');	
        }
        $('.deflink').click(function( e ) {
			showChapter(this.hash.substr(1).charAt(0), this.hash.substr(1));			
        })
    }

    init();

/* EVENT HANDLERS */

    $('#nav a').click(function( e ) {
        //chapter selection handler
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
