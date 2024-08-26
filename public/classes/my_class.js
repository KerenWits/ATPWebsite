class MyClass {
  constructor() {
    if (new.target === MyClass) {
      throw new TypeError("Cannot construct MyClass instances directly");
    }
  }

  fromJson(json) {
    throw new Error("fromJson() has not been implemented");
  }

  toJson() {
    throw new Error("toJson() must be implemented by subclasses");
  }

  toString() {
    throw new Error("toString() must be implemented by subclasses");
  }

  equals(other) {
    throw new Error("equals() must be implemented by subclasses");
  }

  get hashCode() {
    throw new Error("hashCode must be implemented by subclasses");
  }
}

export default MyClass;

// // Example subclass to demonstrate usage
// class ConcreteMyClass extends MyClass {
//   constructor(data) {
//     super();
//     this.data = data;
//   }

//   toJson() {
//     return { data: this.data };
//   }

//   toString() {
//     return `ConcreteMyClass(data: ${this.data})`;
//   }

//   equals(other) {
//     if (!(other instanceof ConcreteMyClass)) {
//       return false;
//     }
//     return this.data === other.data;
//   }

//   get hashCode() {
//     return this.data.hashCode(); // Assuming data has a hashCode method
//   }
// }

// // Example usage
// try {
//   const instance = MyClass.fromJson({});
// } catch (e) {
//   console.error(e.message); // fromJson() has not been implemented
// }

// const concreteInstance = new ConcreteMyClass('example');
// console.log(concreteInstance.toString()); // ConcreteMyClass(data: example)
// console.log(concreteInstance.toJson()); // { data: 'example' }
