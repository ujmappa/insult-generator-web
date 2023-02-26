(function() {
	'use strict';

	let timer;
	const type = (element, speed) => {
		clearInterval(timer);
		const text = element.innerHTML; element.innerHTML = '';
		let index = 0;
		timer = setInterval(function() {
			if (index < text.length) {
				element.append(text.charAt(index++));
			} else {
				clearInterval(timer);
			}
		}, speed);
	}

	window.addEventListener('load', function() {
	  const form = document.querySelector('form.needs-validation');
	  const error = document.querySelector('#error');
	  const result = document.querySelector('#result');
	  form.addEventListener('submit', function(event) {
		error.innerHTML = '', error.classList.add('d-none');
		if (form.checkValidity() === false) {
		  event.preventDefault();
		  event.stopPropagation();
		} else {
		  event.preventDefault();
		  const url = '/api/v1/insult?name=' + encodeURIComponent(document.getElementById('name').value) +
					  '&gender=' + encodeURIComponent(document.getElementById('gender').value);
		  fetch(url, { method: 'GET' })
			.then(function(response) {
			  return response.json();
			})
			.then(function(data) {
			  if (data.error) {
				error.innerHTML = data.error;
			  } else {
				result.innerHTML = data.text;
				type(result, 30);
			  }
			})
			.catch(function(error) {
			  console.error('Fetch error:', error);
			  error.innerHTML = error.message, error.classList.remove('d-none');
			});
		}
		form.classList.add('was-validated');
	  }, false);
	}, false);
  })();