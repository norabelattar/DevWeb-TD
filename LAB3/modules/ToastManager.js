import Toast from "./Toast.js";

export default class ToastManager {
    constructor() {
        this.container = null;
        this.toasts = new Map();
        this.init();
    }

    init() {
        this.container = document.getElementById('toastContainer');
        if(!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            this.container.id = 'toastContainer';
            document.body.appendChild(this.container);
        }

        const clearAllToastsButton = document.getElementById('clear-all-toasts');
        clearAllToastsButton.addEventListener('click', () => {
            this.clear();
        })
    }

    showToastManager(message, type, duration) {
        const toast = new Toast(message, type, duration);
        this.toasts.set(toast.id, toast);

        toast.show(this.container);

        setTimeout(() => {
            this.toasts.delete(toast.id)
        }, duration + 1000);

        return toast;
    }

    success(message, duration) {
        return this.showToastManager(message, 'success', duration);
    }

    info(message, duration) {
        return this.showToastManager(message, 'info', duration);
    }

    error(message, duration) {
        return this.showToastManager(message, 'error', duration);
    }

    clear() {
        this.toasts.forEach((toast) => {
            toast.remove();
        })
        this.toasts.clear();
    }
}

