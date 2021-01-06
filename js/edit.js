function getToken() {
  return localStorage.getItem('token');
}

async function getUserByToken(token) {
  try {
    const res = axios.get('https:api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getBookInfo(bookId) {
  // check token
  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }

  try {
    const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function updateBook(bookId) {
  const titleElement = document.querySelector('#title');
  const messageElement = document.querySelector('#message');
  const authorElement = document.querySelector('#author');
  const urlElement = document.querySelector('#url');

  const title = titleElement.value;
  const message = messageElement.value;
  const author = authorElement.value;
  const url = urlElement.value;

  if (title === '' || message === '' || author === '' || url === '') {
    return;
  }

  const token = getToken();
  if (token === null) {
    location = '/login';
    return;
  }

  await axios.patch(`https://api.marktube.tv/v1/book/${bookId}`, {
    title,
    message,
    author,
    url
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
function render(book) {
  const titleElement = document.querySelector('#title');
  titleElement.value = book.title;

  const messageElement = document.querySelector('#message');
  messageElement.value = book.message;

  const authorElement = document.querySelector('#author');
  authorElement.value = book.author;

  const urlElement = document.querySelector('#url');
  urlElement.value = book.url;

  const form = document.querySelector('#form-edit-book');
  form.addEventListener('submit', async event => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.add('was-validated');

    try {
      await updateBook(book.bookId);
      location.href = `book.html?id=${book.bookId}`;
    } catch (error) {
      console.log(error);
    }
  });
  const cancelButtonElement = document.querySelector('#btn-cancel');
  cancelButtonElement.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();

    location.href = `book.html?id=${book.bookId}`;
  });
}

async function main() {
  // get id from the browser
  const bookId = new URL(location.href).searchParams.get('id');

  // check token
  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }
  // obtain my info with token
  const user = await getUserByToken(token);
  if (user === null) {
    localStorage.clear();
    location.assign('/login');
    return;
  } 
  // get book from the server
  const book = await getBookInfo(bookId);
  if (book === null) {
    alert('fail to show the book Info')
    return;
  }

  // render the book 
  render(book);
}

document.addEventListener('DOMContentLoaded', main);