function getToken() {
  return localStorage.getItem('token');
}
async function logout() {
  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }
  try {
    await axios.delete('https://api.marktube.tv/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log('logout error', error);
  } finally {
    localStorage.clear();
    location.assign('/login');
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

function bindLogOutButton() {
  const btnLogout = document.querySelector('#btn_logout');
  btnLogout.addEventListener('click', logout);
}

async function deleteBook(bookId) {
  const token = getToken();
  if(token === null) {
    location = '/login';
    return;
  }
  await axios.delete(`https:marktube.tv/v1/book/${bookId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

function render(book) {
  const detailElement = document.querySelector('#detail');
  
  detailElement.innerHTML = `<div class="card bg-light w-100">
    <div class="card-header"><h4>${book.title}</h4></div>
    <div class="card-body">
      <h5 class="card-title">"${book.message}"</h5>
      <p class="card-text">글쓴이 : ${book.author}</p>
      <p class="card-text">링크 : <a href="${
        book.url
      }" target="_BLANK">바로 가기</a></p>
      <a href="/edit?id=${book.bookId}" class="btn btn-primary btn-sm">Edit</a>
      <button type="button" class="btn btn-danger btn-sm" id="btn-delete">Delete</button>
    </div>
    <div class="card-footer">
        <small class="text-muted">작성일 : ${new Date(
          book.createdAt,
        ).toLocaleString()}</small>
      </div>
  </div>`;

  document.querySelector('#btn-delete').addEventListener('click', async () => {
    try {
      await deleteBook(book.bookId);
      location.href = '/';
    } catch(error) {
      console(error);
    }
  })
}
async function getUserInfoByToken(token) {
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
async function main() {
  // create an event with button 
  bindLogOutButton();

  // get id from broswer
  const bookId = new URL(location.href).searchParams.get('id');

  // check token
  const token = getToken();
  if (token === null) {
    location.assign('/login');
    return;
  }
  // obtain my info with token
  const user = await getUserInfoByToken(token);
  if (user === null) {
    localStorage.clear();
    location.assign('/login');
    return;
  }
  // get the detailed info of a book from a server
  const book = await getBookInfo(bookId);
  if(book === null) {
    alert('fail to obtain the book info');
    return;
  }
  // show info on screen
  // console.log(book);
  render(book);
}

document.addEventListener('DOMContentLoaded', main);