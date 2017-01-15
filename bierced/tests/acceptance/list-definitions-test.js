import { test } from 'qunit';
import moduleForAcceptance from 'bierced/tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | list definitions');

test('Should redirect to definitions route', function ( assert) {
	visit('/');
	andThen(function() {
		assert.equal(currentURL(), '/definitions', 'should redirect automatically')
	});	
});

test('Should list definitions alphabetically', function( assert ) {
	visit('/');
	andThen(function () {
		assert.equal(find('.definition').length, 995, 'should see 3 definitions');
	});
});

test('Should link to each definition', function ( assert ) {	
	visit('/definitions');
	click('a:contains("abracadabra")');
	andThen(function(){
		assert.equal(currentURL(), '/definitions/abracadabra', 'should navigate to show route');
		assert.equal(find('.show-definitions h2').text(), 'Show abracadabra');
		assert.equal(find('.description').length, 1, 'should list the definition');
	});
});

test('Should link to about page', function ( assert ){	
	visit('/');
	click('a:contains("About")');
	andThen(function () { 
		assert.equal(currentURL(), '/about', 'Should navigate to about');
	});
});

test('Should filter definitions by filtering search', function ( assert ){
	visit('/');
	fillIn('.list-filter input', 'abracadabra');
	keyEvent('.list-filter input', 'keyup', 69);
	andThen(function (){
		assert.equal(find('.listing').length, 1, 'should show one item');
		assert.equal(find('.listing .definition:contains("abracadabra")').length, 1, 'should contains one mention of abracadabra');
	});
});

// test('Should save favorite words', function ( assert ){	
// 	//todo: fill when I know how the testing works and how to automate it
// })

// test('Should hold items in local storage', function ( assert ){	
// 	//todo: fill when I know how the testing works and how to automate it
// })
