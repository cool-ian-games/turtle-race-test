export class DomVariable {
    constructor(value, documentQuery) {
        this.value = value;
        this.domElement = document.querySelector(documentQuery);
    }

    set(newValue) {
        this.value = newValue;
        this.domElement.innerHTML = newValue;
    }

    add(addedValue) {
        this.set(this.value += addedValue);
    }

    subtract(removedValue) {
        this.set(this.value -= removedValue);
    }
}