import ToastManager from './ToastManager.js';

export default class DemoApp {
    constructor() {
        this.toastManager = new ToastManager();
        this.messageInput = null;
        this.buttons = null;
        this.init();
    }

    init() {
        this.messageInput = document.getElementById('messageInput');
        this.buttons = document.querySelectorAll('.toast-button');

        this.bindEvents();
    }

    bindEvents() {
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });

        this.messageInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                this.showToast('info');
            }
        });
    }


    handleButtonClick(event) {
        const type = event.target.getAttribute('data-type');
        this.showToast(type);
    }

    showToast(type) {
        const message = this.messageInput.value.trim();

        if(!message) {
            this.toastManager.error('Veuillez entrer un message !', 500);
            return;
        }

        this.toastManager.showToastManager(message, type, 5000);
    }
}