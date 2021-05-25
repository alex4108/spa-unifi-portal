const REDIRECT_SUCCESS = 'https://pinspiration.com';
const LIST_SERV_URL = 'http://localhost:5000/'; // TODO Change to API Endpoint for Client List Service

class CaptivePortal {
  constructor(params) {
    this.errEl = params.errEl;
    this.emailEl = params.emailEl;
    this.submitEl = params.submitEl;
    this.sucEl = params.sucEl;
    this.contentEl = params.contentEl;
    this.bind();
  }

  bind() {
    this.submitEl.onclick = this.onSubmit.bind(this);
  }

  showError(msg) {
    this.errEl.textContent = `Error: ${msg}`;
    this.errEl.classList.remove('hide');
    this.shake();
  }

  showSuccess(msg) {
    this.sucEl.textContent = `${msg}`;
    this.sucEl.classList.remove('hide');
    this.shake();
  }

  validateEmail(email) { 
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return (true)
    }
    else {
      return (false)
    }
  }

  submitToListService(email) {
    try { 
      fetch('./js/submit.tpl')
        .then(response => response.text())
        .then((data) => { 
          var payload = data;
          payload = payload.replace("MY_EMAIL", email);
          console.log("SENDING PAYLOAD");
          console.log(payload); 
          fetch(LIST_SERV_URL, {
            method: 'post',
            body: payload,
            redirect: 'manual'
          }).then(() => {
            this.loginToUnifi();
          }).catch((err) => {
            this.showError('Internal Error POSTing to List Service');
            console.log(err);
            return;
          });
        }).catch((err) => {
          this.showError('Internal Error fetching submit.tpl');
          console.log(err);
          return;
        });
    }
    catch (error) { 
      console.error(error);
      return "fail";
    }
  }

  loginToUnifi() { 
    fetch('/guest/s/default/login' + location.search, { 
      method: 'post',
      body: '',
      redirect: 'manual',
      mode: 'no-cors'
    }).then(() => {
      this.showSuccess("Welcome!  Redirecting...")
      window.location = REDIRECT_SUCCESS;
    }).catch((err) => {
      this.showError('Internal Error POSTing to Unifi');
      console.log(err);
      return;
    });
  }

  onSubmit() {
    const email = this.emailEl.value;
    if (email.length === 0) {
      this.showError('Please enter your email address');
      return;
    }
    if (this.validateEmail(email)) { 
      this.submitToListService(email);
    }
    else {
      this.showError('Please enter a valid email address');
      return;
    }
  }

  shake() {
    this.contentEl.classList.remove('shake');
    setTimeout(() => {
      this.contentEl.classList.add('shake');
    }, 1);
  }
}
