// abstract class MyClass {
//   constructor() {
//     if (new.target === MyClass) {
//       throw new TypeError("Cannot construct MyClass instances directly");
//     }
//   }

//   abstract fromJson(json: any): void;

//   abstract toJson(): any;

//   abstract toString(): string;

//   abstract equals(other: any): boolean;

//   abstract get hashCode(): number;
// }

// export default MyClass;