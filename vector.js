// Code from
// https://medium.com/@geekrodion/linear-algebra-vectors-f7610e9a0f23
class Vector {
    constructor(...components) {
        this.components = components
    }

    // Vector Addition
    add({
        components
    }) {
        return new Vector(
            ...components.map((component, index) => this.components[index] + component)
        )
    }

    // Vector Subtraction
    subtract({
        components
    }) {
        return new Vector(
            ...components.map((component, index) => this.components[index] - component)
        )
    }

    // Scalar Multiplication
    scaleBy(number) {
        return new Vector(
            ...this.components.map(component => component * number)
        )
    }

    // Magnitude
    length() {
        return Math.hypot(...this.components)
    }

    // Dot product
    dotProduct({ components }) {
        return components.reduce((acc, component, index) => acc + component * this.components[index], 0)
    }
}