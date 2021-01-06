function getToken() {
  return localStorage.getItem('token');
}

async function login(event) {
  event.preventDefault();
  event.stopPropagation();

  const emailElement  = document.querySelector('#inputEmail');
  const passwordElement = document.querySelector('#inputPassword');

  const email = emailElement.value;
  const password = passwordElement.value;

  try {
    const res = await axios.post('https://api.marktube.tv/v1/me', {
      email: email,
      password: password,
    });
    console.log(res);
    
    const { token } = res.data;
    if (token === undefined) {
      return;
    }
    // store token under the name "token";
    localStorage.setItem('token', token);
    location.assign('/');
  } catch(error) {
    const data = error.response.data;
    if (data) {
      const data = error.response.data;
      if (data) {
        const state = data.error;
        if (state === 'USER_NOT_EXIST') {
          alert('NOT REGISTERED');
        } else if (state === 'PASSWORD_NOT_MATCH') {
          alert('password is wrong');
        }
      }
    }
  }
}

function bindLoginButton() {
  const form = document.querySelector('#form-login');

  form.addEventListener('submit', login);

}

function main() {
  // button element
  bindLoginButton();

  // check token
  const token = getToken();
  if (token !== null) {
    location.assign('/');
    return;
  }
}

document.addEventListener('DOMContentLoaded', main);