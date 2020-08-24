console.log('running client side');

const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const msg1 = document.querySelector('#msg-1');
const msg2 = document.querySelector('#msg-2');

weatherForm.addEventListener('submit', e => {
    e.preventDefault();
    fetch(`/weather?address=${search.value}`)
            .then(res => res.json()
                .then(data => {
                    if (data.error) {
                        msg1.textContent = data.error;
                        msg2.textContent = '';
                    } else {
                        msg1.textContent = data.forecast;
                        msg2.textContent = data.location;
                    }
                })
            )
    }
);