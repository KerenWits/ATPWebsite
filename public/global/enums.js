const UserType = Object.freeze({
  ADMIN: "admin",
  EMPLOYEE: "employee",
  MANAGER: "manager",
  CLIENT: "client",
  GUEST: "guest",
});

export default UserType;

const Gender = Object.freeze({
  MALE: "male",
  FEMALE: "female",
});

export { UserType, Gender };
