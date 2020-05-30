class UserDialog extends HTMLElement {

    static get observedAttributes() {
        return ['status', 'user'];
    }

    constructor() {
        super();
    }

    /**
     * 控制modal的显示
     * @param {*} newValue 
     */
    setstatus(newValue) {
        $(this.modal).modal(newValue)
    }

    /**
     * 填充用户数据
     * @param {*} data 
     */
    fullView(data) {
        $(this.modal).find('.department').val(data.department);
        $(this.modal).find('.clas').val(data.clas);
        $(this.modal).find('.name').val(data.name);
        $(this.modal).find('.sex').val(data.sex);
        $(this.modal).find('.studentid').val(data.studentid);
    }

    connectedCallback() {
        var templateElem = document.getElementById('user-dialog');
        this.modal = $(templateElem.content).find('.modal')[0];
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name == 'status') {
            this.setstatus(newValue);
        } else if (name == 'user') {
            this.fullView(JSON.parse(newValue));
        }
    }
}

customElements.define('user-dialog', UserDialog);