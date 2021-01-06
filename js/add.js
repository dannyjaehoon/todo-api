function getToken() {
  return localStorage.getItem('token');
}

async function getUserByToken(token) {
  try {
    const res = await axios.get('https:api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch(error) {
    console.log('getUserByToken error', error);
    return null;
  }
}

async function save(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // was-validated css class is provided by bootstrap
  // show red surrounded area in each input 
  e.target.classList.add('was-validated');

  const $title = document.querySelector('#title');
  const $message = document.querySelector('#message');
  const $author = document.querySelector('#author');
  const $url = document.querySelector('#url');

  const title = $title.value;
  const message = $message.value;
  const author = $author.value;
  const url = $url.value;

  if (title === '' || message === '' || author === '' || url === '') {
    return;
  }

  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  try {
    const res = await axios.post('https://api.marktube.tv/v1/book', {
      title,
      message,
      author,
      url
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    location.assign('/');
  } catch(err) {
    console.log('save error', error);
    alert('fail to add a book')
  }
}

function bindSaveButton() {
  const form = document.querySelector('#form-add-book');
  form.addEventListener('submit', save);
}

async function main() {
  // create an event with button 
  bindSaveButton();

  // check button
  const token = getToken();
  if(token === null) {
    location.assign('/');
    return;
  }
  // obtain my info with token
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.assign('/');
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);