export default class Toast {
    constructor(message, type='info', duration = 3000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.id = Date.now() + Math.random();
        this.element = null;
    }

    getIcon() {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        }
        return icons[this.type] || icons.info;
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = ` toast ${this.type}`;
        this.element.innerHTML = `
            <span class="toast-icon">${this.getIcon()}</span>
            <span class="toast-message">${this.message}</span>
            <button class="toast-close" aria-label="Fermer">X</button>
            `;
        
        const closeButton = this.element.querySelector('.toast-close');
        closeButton.addEventListener('click', () => this.remove());
    }

    show(container) {
        if(!this.element) {
            this.createElement();
        }

        container.appendChild(this.element);
        
        setTimeout(() => {
            this.remove();
        }, this.duration);

        return this;
    }

    remove() {
        if(this.element && this.element.parentNode) {
            this.element.classList.add('removing');
            setTimeout(() => {
                if(this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 300);
        }
    }
}